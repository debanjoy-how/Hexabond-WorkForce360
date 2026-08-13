import { Employee, RiskLevel, ShapFactor } from '../types';
import { mockFetch } from './api';

export interface SimulationParams {
  overtimeReductionHours: number; // e.g. reduce by 8 hours
  salaryIncreasePct: number; // e.g. +10%
  workLifeBalanceBoost: number; // e.g. +20 points
  promotionGranted: boolean;
  manager1on1Biweekly: boolean;
  flexibleRemoteDays: number;
}

export interface SimulationResult {
  originalAttritionRisk: number;
  newAttritionRisk: number;
  attritionRiskDelta: number;
  originalBurnoutRisk: number;
  newBurnoutRisk: number;
  burnoutRiskDelta: number;
  newRiskLevel: RiskLevel;
  confidenceScore: number;
  estimatedCostSavings: number; // in USD
  keyDrivers: string[];
}

export const predictionService = {
  /**
   * Recalculates risk dynamically using our ML inference surrogate model
   * Simulates Python XGBoost + SHAP inference engine output
   */
  async simulateIntervention(employee: Employee, params: SimulationParams): Promise<SimulationResult> {
    let attritionDelta = 0;
    let burnoutDelta = 0;
    const drivers: string[] = [];

    // Overtime impact (weight: ~2.1% risk reduction per hour of overtime cut)
    if (params.overtimeReductionHours > 0) {
      const otBenefit = Math.min(params.overtimeReductionHours * 2.3, 32);
      attritionDelta -= otBenefit;
      burnoutDelta -= otBenefit * 1.4;
      drivers.push(`Reduced ${params.overtimeReductionHours}h overtime (-${Math.round(otBenefit)}% attrition risk)`);
    }

    // Salary Increase impact (weight: ~1.2% risk reduction per 1% raise)
    if (params.salaryIncreasePct > 0) {
      const salaryBenefit = Math.min(params.salaryIncreasePct * 1.3, 26);
      attritionDelta -= salaryBenefit;
      burnoutDelta -= salaryBenefit * 0.4;
      drivers.push(`+${params.salaryIncreasePct}% compensation adjustment (-${Math.round(salaryBenefit)}% attrition risk)`);
    }

    // Promotion impact
    if (params.promotionGranted) {
      attritionDelta -= 18;
      burnoutDelta -= 6;
      drivers.push('Role advancement & promotion reclassification (-18% flight risk)');
    }

    // Work-Life Balance boost
    if (params.workLifeBalanceBoost > 0) {
      const wlbBenefit = Math.min(params.workLifeBalanceBoost * 0.6, 22);
      attritionDelta -= wlbBenefit;
      burnoutDelta -= wlbBenefit * 1.2;
      drivers.push(`Enhanced work-life boundary support (-${Math.round(wlbBenefit * 1.2)}% burnout risk)`);
    }

    // Manager 1:1 structured cadence
    if (params.manager1on1Biweekly) {
      attritionDelta -= 9;
      burnoutDelta -= 11;
      drivers.push('Structured bi-weekly 1:1 manager coaching (-9% flight risk)');
    }

    // Flexible Remote Days
    if (params.flexibleRemoteDays > 0) {
      const flexBenefit = Math.min(params.flexibleRemoteDays * 3.5, 14);
      attritionDelta -= flexBenefit;
      burnoutDelta -= flexBenefit * 1.1;
      drivers.push(`+${params.flexibleRemoteDays} flexible hybrid remote days (-${Math.round(flexBenefit)}% attrition)`);
    }

    const rawNewAttrition = Math.max(5, Math.min(95, Math.round(employee.attritionProbability + attritionDelta)));
    const rawNewBurnout = Math.max(5, Math.min(95, Math.round(employee.burnoutProbability + burnoutDelta)));

    const getRiskLevel = (prob: number): RiskLevel => {
      if (prob >= 70) return 'High';
      if (prob >= 35) return 'Medium';
      return 'Low';
    };

    // Estimated replacement cost = 1.5x employee salary if high risk turns into voluntary departure
    const departureRiskReducedPct = (employee.attritionProbability - rawNewAttrition) / 100;
    const estReplacementCost = employee.salary * 1.25;
    const estimatedCostSavings = Math.round(departureRiskReducedPct * estReplacementCost);

    const result: SimulationResult = {
      originalAttritionRisk: employee.attritionProbability,
      newAttritionRisk: rawNewAttrition,
      attritionRiskDelta: Math.round(rawNewAttrition - employee.attritionProbability),
      originalBurnoutRisk: employee.burnoutProbability,
      newBurnoutRisk: rawNewBurnout,
      burnoutRiskDelta: Math.round(rawNewBurnout - employee.burnoutProbability),
      newRiskLevel: getRiskLevel(rawNewAttrition),
      confidenceScore: 94.2,
      estimatedCostSavings: Math.max(0, estimatedCostSavings),
      keyDrivers: drivers.length ? drivers : ['No adjustments applied'],
    };

    const res = await mockFetch(result, 180);
    return res.data;
  },

  async getShapExplanation(employeeId: string): Promise<{
    baseValue: number;
    prediction: number;
    factors: ShapFactor[];
    naturalLanguageSummary: string;
  }> {
    // Return SHAP force plot breakdown
    const res = await mockFetch(
      {
        baseValue: 32, // population baseline attrition average
        prediction: 87,
        factors: [],
        naturalLanguageSummary:
          'Explainable AI model decomposed employee flight factors using TreeSHAP algorithm with 94.2% statistical confidence.',
      },
      100
    );
    return res.data;
  },
};
