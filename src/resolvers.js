const { find, filter} = require('lodash');
const EstimatedChildBirths = require('./data/EstimatedChildBirths');
const Incomes = require('./data/Incomes');
const NationalRegistry = require('./data/National_registry');
const config = require('./config/configuredValues')

module.exports = {
    Query: {
        registries() {
            return NationalRegistry;
        },
        infoBySSN(_, {SSN}) {
            info = {
                SSN,
                Registry: NationalRegistry.find(value => value.SSN === SSN),
                Income: Incomes.find(value => value.SSN === SSN),
                EstimatedChildBirth : EstimatedChildBirths.find(value => value.ParentSSN === SSN),
            };
            return {
                SSN,
                Name : !info.Registry ? "NO DATA" : info.Registry.Name,
                Address : !info.Registry ? "NO DATA" : info.Registry.Address,
                HasIncomes: !(!info.Income),
                MonthIncome: !info.Income ? 0 : info.Income.MonthIncome,
                OtherMonthIncome: !info.Income ? 0 : info.Income.OtherMonthIncome,
                PensionSavings: !info.Income ? 0 : info.Income.PensionSavings,
                PersonalDiscount: !info.Income ? 0 : info.Income.PersonalTaxDiscount,
                ChildEstimateBirthDate: !info.EstimatedChildBirth ? null : info.EstimatedChildBirth.EstimatedBirthDate
            }
        },
        calculateFinalAmount(_, {calcRequest}) {
            console.log(JSON.stringify(calcRequest));
            let SSN = calcRequest.SSN;
            let workingType = calcRequest.WorkingType;
            let pensionSavingsPercentage = calcRequest.PensionSavings;
            let personalDiscount = calcRequest.PersonalDiscount;
            let periods = calcRequest.Periods;

            let minAmount = config.getMinimumAmountForWorkingType(workingType);
            if (workingType === config.WORKING_TYPE.EDUCATION || workingType === config.WORKING_TYPE.OUT_OF_LABOR) {
                let grossAmount = minAmount;
                let selectedRate = config.getPercentageForAmount(grossAmount);
                let tax = selectedRate * grossAmount / 100;
                let discount = config.PERSONAL_TAX_CREDIT * personalDiscount / 100;
                let netAmount = grossAmount - tax + discount;

                let output = periods.map(p => new Object({StartDate : p.StartDate, EndDate : p.EndDate, AmountNet : netAmount,
                    AmountGross : grossAmount, Tax : new Object({Total : tax, RateSelected : selectedRate, Discount: discount})}));
                return {
                    SSN,
                    Periods: output
                }
            }

            //for workers
            let Income = Incomes.find(value => value.SSN === SSN)
            let averageSalary = Income.MonthIncome + Income.OtherMonthIncome

            let output = periods.map(p => {
                let grossAmount = Math.max(Math.min(averageSalary * 0.8, config.MAXIMUM_AMOUNT), minAmount) * p.LeavePercentage / 100;
                let pensionFonds = averageSalary * 0.8 * config.PENSION_FOND / 100;
                let pensionSavings = averageSalary * 0.8 * pensionSavingsPercentage / 100;
                let selectedRate = config.getPercentageForAmount(grossAmount);
                let tax = selectedRate * (grossAmount - pensionFonds - pensionSavings) / 100;
                let discount = config.PERSONAL_TAX_CREDIT * personalDiscount / 100;
                let netAmount = grossAmount - tax + discount;

                return new Object({StartDate : p.StartDate, EndDate : p.EndDate, AmountNet : netAmount,
                    AmountGross : grossAmount, PensionFond: pensionFonds, PensionSavings: pensionSavings,
                    Tax : new Object({Total : tax, RateSelected : selectedRate, Discount: discount})})
            });
            return {
                SSN,
                Periods: output
            }


        }
    },
};
