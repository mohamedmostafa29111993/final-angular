export class   CalculatedRowFormDataDto {
    dimentionId: number;
    bestPractice: number | undefined;
    baseLine: number | undefined;
    historical: number | undefined;
    actual: number | undefined;
    target: number | undefined;
    actual_Growth_BP: number | undefined;
    required_Growth_BL: number | undefined;
    bL_Growth_Achievement: number | undefined;
    bP_Growth_Achievement: number | undefined;
    required_Growth_BP: number | undefined;
    actual_Growth_BL: number | undefined;
    fullCapacity: number | undefined;
    businessRoleId: number;
    businessUnitId: number;
    sectionId: number;
    indicatorId: number;
    constructor() {
        this.dimentionId = 0;
        this.bestPractice = null; 
        this.baseLine = null;
        this.historical = null;
        this.actual = null;
        this.target = null;
        this.actual_Growth_BP = null;
        this.required_Growth_BL = null;
        this.bL_Growth_Achievement = null;
        this.bP_Growth_Achievement = null;
        this.required_Growth_BP = null;
        this.actual_Growth_BL = null;
        this.fullCapacity = null;
      }
}
