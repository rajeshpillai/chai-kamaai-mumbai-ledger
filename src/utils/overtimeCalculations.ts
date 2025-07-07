import { ShiftType } from '@/contexts/ShiftContext';

export interface OvertimeRules {
  weekdayMultiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  nightDifferential: number;
  consecutiveDayBonus: number;
  maxDailyOvertimeHours: number;
  maxWeeklyOvertimeHours: number;
}

export const DEFAULT_OVERTIME_RULES: OvertimeRules = {
  weekdayMultiplier: 1.5,    // 1.5x for weekday overtime
  weekendMultiplier: 2.0,    // 2x for weekend work
  holidayMultiplier: 2.5,    // 2.5x for holiday work
  nightDifferential: 0.15,   // 15% additional for night shifts
  consecutiveDayBonus: 0.1,  // 10% bonus for consecutive days
  maxDailyOvertimeHours: 4,  // Max 4 hours overtime per day
  maxWeeklyOvertimeHours: 20 // Max 20 hours overtime per week
};

export interface OvertimeCalculationInput {
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  shiftType: ShiftType;
  date: string;
  consecutiveDays: number;
  isHoliday?: boolean;
}

// Helper function to ensure valid number
const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const calculateOvertimePay = (input: OvertimeCalculationInput): {
  regularPay: number;
  overtimePay: number;
  nightDifferential: number;
  consecutiveBonus: number;
  totalPay: number;
} => {
  const { regularHours, overtimeHours, hourlyRate, shiftType, date, consecutiveDays, isHoliday } = input;
  const rules = DEFAULT_OVERTIME_RULES;
  
  // Validate inputs
  const validRegularHours = safeNumber(regularHours);
  const validOvertimeHours = safeNumber(overtimeHours);
  const validHourlyRate = safeNumber(hourlyRate);
  const validConsecutiveDays = safeNumber(consecutiveDays);
  
  // Base pay calculations
  const regularPay = safeNumber(validRegularHours * validHourlyRate);
  
  // Determine overtime multiplier
  let overtimeMultiplier = rules.weekdayMultiplier;
  const dayOfWeek = new Date(date).getDay();
  
  if (isHoliday) {
    overtimeMultiplier = rules.holidayMultiplier;
  } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
    overtimeMultiplier = rules.weekendMultiplier;
  }
  
  // Cap overtime hours based on rules
  const cappedOvertimeHours = Math.min(validOvertimeHours, rules.maxDailyOvertimeHours);
  
  // Calculate overtime pay
  const baseovertimePay = safeNumber(cappedOvertimeHours * validHourlyRate * overtimeMultiplier);
  
  // Night differential (applies to all hours for night shifts)
  const nightDifferential = shiftType === 'Night' 
    ? safeNumber((validRegularHours + cappedOvertimeHours) * validHourlyRate * rules.nightDifferential)
    : 0;
  
  // Consecutive days bonus (applies to total pay)
  const consecutiveBonus = validConsecutiveDays >= 6 
    ? safeNumber((regularPay + baseovertimePay) * rules.consecutiveDayBonus)
    : 0;
  
  const totalPay = safeNumber(regularPay + baseovertimePay + nightDifferential + consecutiveBonus);
  
  return {
    regularPay: Math.round(safeNumber(regularPay)),
    overtimePay: Math.round(safeNumber(baseovertimePay)),
    nightDifferential: Math.round(safeNumber(nightDifferential)),
    consecutiveBonus: Math.round(safeNumber(consecutiveBonus)),
    totalPay: Math.round(safeNumber(totalPay))
  };
};

export const calculateMonthlyOvertime = (
  employeeId: number,
  month: number,
  year: number,
  attendanceRecords: any[],
  hourlyRate: number
): {
  totalOvertimeHours: number;
  totalOvertimePay: number;
  weeklyBreakdown: { week: number; hours: number; pay: number }[];
} => {
  if (!attendanceRecords || attendanceRecords.length === 0 || safeNumber(hourlyRate) <= 0) {
    return {
      totalOvertimeHours: 0,
      totalOvertimePay: 0,
      weeklyBreakdown: []
    };
  }

  const monthRecords = attendanceRecords.filter(record => {
    if (!record.date) return false;
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === month - 1 && 
           recordDate.getFullYear() === year && 
           record.employeeId === employeeId;
  });
  
  let totalOvertimeHours = 0;
  let totalOvertimePay = 0;
  const weeklyBreakdown: { week: number; hours: number; pay: number }[] = [];
  
  // Group by week
  const weeks = new Map<number, any[]>();
  monthRecords.forEach(record => {
    const date = new Date(record.date);
    const weekNumber = Math.ceil(date.getDate() / 7);
    if (!weeks.has(weekNumber)) {
      weeks.set(weekNumber, []);
    }
    weeks.get(weekNumber)!.push(record);
  });
  
  weeks.forEach((weekRecords, weekNumber) => {
    let weekOvertimeHours = 0;
    let weekOvertimePay = 0;
    
    weekRecords.forEach(record => {
      const recordOvertimeHours = safeNumber(record.overtimeHours);
      if (recordOvertimeHours > 0) {
        const overtimeCalc = calculateOvertimePay({
          regularHours: safeNumber(record.regularHours),
          overtimeHours: recordOvertimeHours,
          hourlyRate: safeNumber(hourlyRate),
          shiftType: 'Day', // Default, should be determined from shift context
          date: record.date,
          consecutiveDays: 0, // Would need to calculate consecutive days
          isHoliday: false // Would need holiday calendar
        });
        
        weekOvertimeHours += recordOvertimeHours;
        weekOvertimePay += safeNumber(overtimeCalc.overtimePay);
      }
    });
    
    // Cap weekly overtime
    const cappedWeeklyHours = Math.min(weekOvertimeHours, DEFAULT_OVERTIME_RULES.maxWeeklyOvertimeHours);
    const cappedWeeklyPay = weekOvertimeHours > 0 ? 
      safeNumber(weekOvertimePay * (cappedWeeklyHours / weekOvertimeHours)) : 0;
    
    totalOvertimeHours += cappedWeeklyHours;
    totalOvertimePay += cappedWeeklyPay;
    
    weeklyBreakdown.push({
      week: weekNumber,
      hours: safeNumber(cappedWeeklyHours),
      pay: Math.round(safeNumber(cappedWeeklyPay))
    });
  });
  
  return {
    totalOvertimeHours: safeNumber(Number(totalOvertimeHours.toFixed(2))),
    totalOvertimePay: Math.round(safeNumber(totalOvertimePay)),
    weeklyBreakdown
  };
};
