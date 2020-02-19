const FULL_TIME_MINIMUM_AMOUNT = 184119;
const PART_TIME_MINIMUM_AMOUNT = 132850;
const OUT_OF_LABOR_MINIMUM_AMOUNT = 80341;
const STUDYING_MINIMUM_AMOUNT = 184119;

const SMALL_INCOME = 336916;
const SMALL_PERCENTAGE = 35.04;
const HIGH_INCOME = 945873;
const HIGH_PERCENTAGE = 37.19;
const HIGHEST_PERCENTAGE = 46.24;

module.exports = {
MAXIMUM_AMOUNT : 600000,

PENSION_FOND : 4, //percent
PERSONAL_TAX_CREDIT : 54628,

WORKING_TYPE : {
    FULL_TIME: "FullTime",
    PART_TIME: "PartTime",
    OUT_OF_LABOR: "OutOfLabor",
    EDUCATION: "Education"
},

getPercentageForAmount : function getPercentageForAmount(amount) {
    return amount <= SMALL_INCOME ? SMALL_PERCENTAGE : amount <= HIGH_INCOME ? HIGH_PERCENTAGE : HIGHEST_PERCENTAGE;
},

getMinimumAmountForWorkingType : function getMinimumAmountForWorkingPercentage(workingType) {
    return workingType === this.WORKING_TYPE.FULL_TIME ? FULL_TIME_MINIMUM_AMOUNT
        : workingType === this.WORKING_TYPE.PART_TIME ? PART_TIME_MINIMUM_AMOUNT
            : workingType === this.WORKING_TYPE.OUT_OF_LABOR ? OUT_OF_LABOR_MINIMUM_AMOUNT
                : STUDYING_MINIMUM_AMOUNT
}
};