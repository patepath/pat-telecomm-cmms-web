import { Component } from '@angular/core';
import { IssueInquiry, IssueType, LineswapIssue, LoginInfo, Operator, Phone } from '../../interfaces';
import { Subject } from 'rxjs/internal/Subject';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LineswapService } from '../../services/lineswap.service';
import { PhoneService } from '../../services/phone.service';
import { OperatorService } from '../../services/operator.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/internal/operators/filter';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { LineswapEditService } from '../../services/lineswap-edit.service';

@Component({
  selector: 'app-lineswap-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lineswap-edit.component.html',
  styleUrl: './lineswap-edit.component.css'
})
export class LineswapEditComponent {
	public issueTypes: IssueType[]=[];
	public issuetype: number=0;
	public issueInquiry: number=0;
	public issueInquiries: IssueInquiry[]=[];

	public phones: Phone[]=[];
	public phone: Phone=<Phone>{};

	public operator: Operator=<Operator>{};
	public operators: Operator[]=[];

	public search: string='';
	public onSearchPhone$ = new Subject<string>();

	public searchPhoneBy: string='';
	public onSearchPhoneBy$ = new Subject<string>();
	
	public token: string='';
	public role: number=0;
	public lineswapIssueFrm: FormGroup; 
	public lineswapIssue: LineswapIssue=<LineswapIssue>{}

	public issue: LineswapIssue=<LineswapIssue>{}
	public issues: LineswapIssue[]=[];
	public info: LoginInfo=<LoginInfo>{}

  public issuetypes: IssueType[]=[];

	constructor(
    private readonly _activeRoute: ActivatedRoute,
	private readonly _serv: LineswapEditService,
    protected readonly _lineswpServ: LineswapService,
	) { 

		this.lineswapIssueFrm = new FormGroup({
			id: new FormControl(0),
			issueno: new FormControl({value: '', disabled: true}),
			phone: new FormControl({value: '', disabled: true}, Validators.required),
			phoneby: new FormControl({value: '', disabled: true}),
			location: new FormControl({value: '', disabled: true}),
			created: new FormControl({value: '', disabled: true}),
			linetype: new FormControl({value: 1, disabled: true }),
			issuetype: new FormControl({value: 0, disabled: true}, Validators.required),
			issueinquiry: new FormControl({value: 0, disabled: true}, Validators.required),
			issuecontactno: new FormControl({value: '', disabled: true}, Validators.required),
			issuedescription: new FormControl({value: '', disabled: true}, Validators.required),
			issueremark: new FormControl({value: '', disabled: true}),
			finisheddate: new FormControl(),
			status: new FormControl(0),
		});

		this._lineswpServ.getIssueTypesLineSwap().subscribe(rs => {
			this.issueTypes = rs;
		});

		this._lineswpServ.getIssueInquiry().subscribe(rs => {
			this.issueInquiries = rs;
			this.lineswapIssue.issueinquiry = 0;
		});

		let storage = localStorage.getItem('info');
		if(storage) {
			let info: LoginInfo = JSON.parse(storage);
			this.role = info.role;
			this.token = info.token;
		}

    this.initField();
		
	}

  initField() {
    this._activeRoute.params.subscribe(parm => {
      if(parm) {
        this._serv.findbyid(this.token, parm['id']).subscribe(rs => {
          this.issue = rs;

          this.lineswapIssueFrm.get('id')?.setValue(this.issue.id);
          this.lineswapIssueFrm.get('issueno')?.setValue(this.issue.issueno);
          this.lineswapIssueFrm.get('phone')?.setValue(this.issue.phone.number);
          this.lineswapIssueFrm.get('location')?.setValue(this.issue.phone.location);
          this.lineswapIssueFrm.get('created')?.setValue(this.issue.created);
          this.lineswapIssueFrm.get('linetype')?.setValue(this.issue.linetype === 1 ? 'สายใน' : 'สายนอก');
          this.lineswapIssueFrm.get('issuetype')?.setValue(this.issueTypes[this.issue.issuetype].name);
          this.lineswapIssueFrm.get('issueinquiry')?.setValue(this.issueInquiries[this.issue.issueinquiry].name);
          this.lineswapIssueFrm.get('issuecontactno')?.setValue(this.issue.issuecontactno);
          this.lineswapIssueFrm.get('issuedescription')?.setValue(this.issue.issuedescription);
          this.lineswapIssueFrm.get('issueremark')?.setValue(this.issue.issueremark);
          this.lineswapIssueFrm.get('finisheddate')?.setValue(this.issue.finisheddate);
          this.lineswapIssueFrm.get('status')?.setValue(this.issue.status);
          

        });
      }
    });
  }

  close() {
    window.close();
  }
}
