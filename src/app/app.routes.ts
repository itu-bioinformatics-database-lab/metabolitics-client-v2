import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageComponent } from 'src/metabol.search-engine/components';
import { MainComponent } from './main/main.component';

const appRoutes: Routes = [
    {path: 'documentation', loadChildren: ()=> import('../documentation/documentation.module').then(m=>m.DocumentationModule)},
    {path: 'demo', loadChildren: ()=> import('../demo/demo.module').then(m=>m.DemoModule)},
    {path: 'panel',  loadChildren:()=> import('../metabol.panel/metabol.panel.module').then(m=>m.MetabolPanelModule)},
    {path: 'auth', loadChildren:()=> import('../metabol.auth/metabol.auth.module').then(m=>m.MetabolAuthModule)},
    {path: 'search', loadChildren:()=> import('../metabol.search-engine').then(m=>m.SearchEngineModule)},
    
    {path: 'main', component: MainComponent},
    {path: '', redirectTo: '/main', pathMatch:'full'}

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
