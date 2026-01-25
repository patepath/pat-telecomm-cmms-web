import { Component, AfterViewInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIfileAttach, FileAttachInfomation, IssueType, LineswapIssue, LoginInfo, Operator, Phone, User } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, Subject, switchMap } from 'rxjs';
import { PhoneService } from '../../services/phone.service';
import { OperatorService } from '../../services/operator.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LineswapService } from '../../services/lineswap.service';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-lineswap-new-issue',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lineswap-new-issue.component.html',
  styleUrl: './lineswap-new-issue.component.css'
})
export class LineswapNewIssueComponent {
	public dataTable!: DataTable;
	public data!: string[][];
	public issueTypes: IssueType[]=[];
	public issuetype: number=0;

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

	public selectedFile: File | null = null;
	public files: FileList = <FileList>{};
	public filenames: string[]=[];
	public previews: SafeResourceUrl[]=[];
	
	public apiFileAttach: APIfileAttach=<APIfileAttach>{};
	public fileAttachs: FileAttachInfomation[]=[];
	public isattach: boolean = false;
  
	constructor(
		private readonly _router: Router,
		private readonly _lineswpServ: LineswapService,
		private readonly _phoneServ: PhoneService,
		private readonly _operatorServ: OperatorService
	) { 

		this.dataTable = {
			headerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'สายโทรเข้า', 'ประเภทงาน', 'โทรศัพท์ติดต่อ' ],
			footerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'สายโทรเข้า', 'ประเภทงาน', 'โทรศัพท์ติดต่อ' ],
			dataRows: [],
		};

		this.data = [];

		this.lineswapIssueFrm = new FormGroup({
			id: new FormControl(0),
			issueno: new FormControl(''),
			phone: new FormControl(<Phone>{}, Validators.required),
			phoneby: new FormControl('' ),
			tech: new FormControl(<User>{}),
			created: new FormControl(new Date()),
			issuetype: new FormControl(0, Validators.min(1)),
			issuetypeother: new FormControl(''),
			issueby: new FormControl('', Validators.required),
			issuecontactno: new FormControl('', Validators.required),
			issuedescription: new FormControl('', Validators.required),
			issuelocation: new FormControl(''),
			issuecause: new FormControl(),
			issuesolution: new FormControl(),
			engineercode: new FormControl(),
			finisheddate: new FormControl(),
			status: new FormControl(0),
			partusages: new FormControl(),
			isattach: new FormControl(false),
		});

		this._lineswpServ.getIssueTypes().subscribe(rs => {
			this.issueTypes = rs;
			this.lineswapIssue.issuetype = 0;
		});

		let storage = localStorage.getItem('info');
		if(storage) {
			let info: LoginInfo = JSON.parse(storage);
			this.role = info.role;
			this.token = info.token;
		}
		
		this.onSearchPhone$
		.pipe(
			filter(val => val.length > 2),
			debounceTime(600),
			switchMap(val =>  { return this._phoneServ.findbynumber(val) })
		)
		.subscribe(val => {
			this.phones=val;

			if(this.phones.length == 1) {
				this.lineswapIssueFrm.get('phone')?.setValue(this.phones[0]);
			}
		});

		this.onSearchPhoneBy$
		.pipe(
			filter(val => val.length > 2),
			debounceTime(600),
			switchMap(val =>  { return this._operatorServ.findByPhone(val) })
		)
		.subscribe(val => {
			this.operators=val;

			if(this.operators.length == 1) {
				this.lineswapIssueFrm.get('phoneby')?.setValue(this.operators[0].phonenumber);
			}
		});
	}

	searchPhone(search: string) {
		this.onSearchPhone$.next(search);
	}

	searchPhoneby(search: string) {
		this.onSearchPhoneBy$.next(search);
	}

	changeLocation() {
		var search: HTMLInputElement = <HTMLInputElement>document.getElementById('search');
		var phone: Phone = <Phone>this.lineswapIssueFrm.get('phone')?.value

		search.value = phone == null ? '' : phone.number;	
	}

	changeIssueLocation() {
		var issueLocation: HTMLSelectElement = <HTMLSelectElement>document.getElementById('issueLocation');
		this.lineswapIssueFrm.get('issuecontactno')?.setValue(this.operators[issueLocation.selectedIndex].phonenumber);
	}

	newLineSwapIssue() {
		this.lineswapIssue = <LineswapIssue>{};
		this.lineswapIssue.id = 0;  
	}

	searchIssue() {
		this._router.navigate(['/lineswap-issue-search']);
	}

	save() {
		if(this.lineswapIssue.id == 0){
			this.lineswapIssue.created = new Date();
		}

		this.lineswapIssue = <LineswapIssue> this.lineswapIssueFrm.value;
		this.lineswapIssue.issuetype = Number(this.lineswapIssueFrm.get('issuetype')?.value);
		this.lineswapIssue.status = Number(this.lineswapIssueFrm.get('status')?.value);

		this._lineswpServ.save(this.token, this.lineswapIssue).subscribe(rs => {
			this.lineswapIssue.issueno = rs.issueno;

			this.newLineSwapIssue();
			this.searchIssue();
		});
	}

	print() {
		const url = this._router.serializeUrl(this._router.createUrlTree(
			['/prn-newissue'], 
			{ 
				queryParams: {
					no: this.lineswapIssue.phone.number,
					location: this.lineswapIssue.phone.location,
					type: this.lineswapIssue.issuetype,
					other: this.lineswapIssue.issuetypeother
				} 
			}
		));

		window.open(url, '_blank');
	}
}
