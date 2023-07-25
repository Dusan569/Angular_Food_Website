import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceHolderDirecctive{
    constructor(public viewContainerRef: ViewContainerRef){}

}