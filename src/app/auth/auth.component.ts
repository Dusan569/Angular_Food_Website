import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component"
import { PlaceHolderDirecctive } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string | null = null;
    @ViewChild(PlaceHolderDirecctive) alertHost!: PlaceHolderDirecctive;

    private closeSub!: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}

    onSwithcMode(){
        this.isLoginMode = !this.isLoginMode;
        this.error = null;
    }

    onSubmit(form: NgForm){
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        
        let auth: Observable<AuthResponseData>;
        
        this.isLoading = true;
        
        if(this.isLoginMode){
            auth = this.authService.login(email, password);
        }else{
            auth = this.authService.signUp(email, password);
        }

        auth.subscribe(response =>{
            console.log(response);
            this.isLoading = false;
            
        }, errorMessage => {
            this.isLoading = false;
            this.error = errorMessage;
            this.showErrorAlert(errorMessage);
        });

        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showErrorAlert(message: string){
        // const alertCmp = new AlertComponent();
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;

        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

        componentRef.instance.message = message;
        componentRef.instance.close.subscribe(() => {
            this.closeSub = componentRef.instance.close.subscribe(() => {
                this.closeSub.unsubscribe();
                hostViewContainerRef.clear();
            })
        });
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }
}