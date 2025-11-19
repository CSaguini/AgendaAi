import { TestBed } from "@angular/core/testing";
import { ServicesEntreprenuerService } from "./servicesEntreprenuer.service";

describe('servicesEntreprenuerService', () => {
   let service: ServicesEntreprenuerService;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ServicesEntreprenuerService);
   });

   it('should be created', () => {
    expect(service).toBeTruthy();
   });

});