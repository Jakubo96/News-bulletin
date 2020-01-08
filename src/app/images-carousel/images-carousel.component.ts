import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-images-carousel',
    templateUrl: './images-carousel.component.html',
    styleUrls: ['./images-carousel.component.scss']
})
export class ImagesCarouselComponent implements OnInit {

    @Input() public imagesUrls: string[];
    @Output() public imageRemoved = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

    public removeUrl(i: number): void {
        this.imageRemoved.emit(i);
    }
}
