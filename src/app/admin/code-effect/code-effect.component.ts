import { element } from 'protractor';
// import { BusinessRuleDto, FormColumnDto, CodeEffectsRuleInputDto } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Input } from '@angular/core';
// import { CodeEffectsServiceProxy } from '@shared/service-proxies/service-proxies';

declare var $: any;
declare var codeeffects;
declare var $rule: any;

@Component({
  selector: 'app-code-effect',
  templateUrl: './code-effect.component.html',
  styleUrls: ['./code-effect.component.css']
})
export class CodeEffectComponent implements OnInit {
  // @Input() ruleData: any;
  // responseRuleData: any;
  // isLoaded: boolean;

  // businessRuleDto: BusinessRuleDto = new BusinessRuleDto();
  // formColumnDto: FormColumnDto = new FormColumnDto();
  // codeEffectsRuleInputDto: CodeEffectsRuleInputDto = new CodeEffectsRuleInputDto();
  constructor(
    // private _codeEffectsServiceProxy: CodeEffectsServiceProxy
    ) {
  }
  ngOnInit(): void {
    this.loadSetting();
  }
  loadSetting() {
    // debugger;
    // let comp = this;
    // let input = new CodeEffectsRuleInputDto();
    // comp.isLoaded = true;
    // comp._codeEffectsServiceProxy.loadSettings().subscribe(
    //   data => {
    //     comp.isLoaded = false;
    //     codeeffects = $rule.init(data.editorData);
    //     codeeffects.clear();
    //     codeeffects.setClientActions(loadRule, deleteRule, save);
    //     // Load the source settings
    //     codeeffects.loadSettings(data.sourceData);
    //     // Use the evaluateRule method as Test button's click event handler
    //     $('#Button').click(null);
    //     console.log(data);

    //   }, error => {
    //     comp.isLoaded = true;
    //   });
    // function save() {
    //   //debugger
    //   const datarule = codeeffects.extract();
    //   comp.codeEffectsRuleInputDto.data = datarule;
    //   comp._codeEffectsServiceProxy.saveRule(comp.codeEffectsRuleInputDto).subscribe(
    //     data => {
    //       comp.responseRuleData = data;
    //       $('#Info').text('The rule was saved successfully');
    //       console.log(data);
    //       comp.isLoaded = false;
    //     }, error => {
    //       comp.isLoaded = true;
    //     });
    // }

    // function loadRule(ruleId: any) {
    //   input.data = ruleId;
    //   comp._codeEffectsServiceProxy.loadRule(input).subscribe(
    //     data => {
    //       comp.responseRuleData = data;
    //       codeeffects.loadRule(comp.responseRuleData);
    //       console.log(data);
    //       comp.isLoaded = false;
    //     }, error => {
    //       comp.isLoaded = true;
    //     });
    // }

    // function deleteRule(ruleId: any) {
    //   debugger;
    //   comp._codeEffectsServiceProxy.deleteRule(ruleId).subscribe(
    //     data => {
    //       // debugger;
    //       comp.responseRuleData = data;
    //       codeeffects.deleted(codeeffects.getRuleId());
    //       codeeffects.clear();
    //       console.log(data);
    //       comp.isLoaded = false;
    //     }, error => {
    //       comp.isLoaded = true;
    //     });
    // }
  }

}
