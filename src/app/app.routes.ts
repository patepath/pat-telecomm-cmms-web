import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { NewIssueComponent } from './models/new-issue/new-issue.component';
import { JobsTodayComponent } from './models/jobs-today/jobs-today.component';
import { JobsProcessComponent } from './models/jobs-process/jobs-process.component';
import { JobsClosedComponent } from './models/jobs-closed/jobs-closed.component';
import { JobsClosedTechComponent } from './models/jobs-closed-tech/jobs-closed-tech.component';
import { LoginComponent } from './models/login/login.component';
import { SettingUserComponent } from './models/setting-user/setting-user.component';
import { SettingDepartmentComponent } from './models/setting-department/setting-department.component';
import { SettingPhoneComponent } from './models/setting-phone/setting-phone.component';
import { SettingPartComponent } from './models/setting-part/setting-part.component';
import { SettingLineswapComponent } from './models/setting-lineswap/setting-lineswap.component';
import { EditIssueComponent } from './models/edit-issue/edit-issue.component';
import { PrnNewissueComponent } from './models/prn-newissue/prn-newissue.component';
import { ReportByStatusComponent } from './models/report-by-status/report-by-status.component';
import { ReportBySummaryComponent } from './models/report-by-summary/report-by-summary.component';
import { ProfileComponent } from './models/profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'prn-newissue', component: PrnNewissueComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
    { 
        path: 'admin', 
        component: DefaultLayoutComponent,
        children: [
            { path: 'new-issue', component: NewIssueComponent },
            { path: 'edit-issue/:id', component: EditIssueComponent },
            { path: 'jobs-today', component: JobsTodayComponent },
            { path: 'jobs-process', component: JobsProcessComponent },
            { path: 'jobs-closed', component: JobsClosedComponent },
            { path: 'report-by-status', component: ReportByStatusComponent },
            { path: 'report-by-summary', component: ReportBySummaryComponent },
            { path: 'setting-user', component: SettingUserComponent},
            { path: 'setting-department', component: SettingDepartmentComponent},
            { path: 'setting-part', component: SettingPartComponent},
            { path: 'setting-phone', component: SettingPhoneComponent},
            { path: 'setting-profile', component: ProfileComponent },
        ]
    },
    { 
        path: 'tech', 
        component: DefaultLayoutComponent,
        children: [
            { path: 'new-issue', component: NewIssueComponent },
            { path: 'jobs-today', component: JobsTodayComponent },
            { path: 'jobs-closed-tech', component: JobsClosedTechComponent },
            { path: 'setting-phone', component: SettingPhoneComponent },
        ]
    },
    {
        path: 'operator',
        component: DefaultLayoutComponent,
        children: [
            { path: 'new-issue', component: NewIssueComponent },
            { path: 'jobs-today', component: JobsTodayComponent },
            { path: 'jobs-closed-tech', component: JobsClosedTechComponent },
            { path: 'setting-phone', component: SettingPhoneComponent },
            { path: 'setting-lineswap', component: SettingLineswapComponent },
        ]
    }
];
