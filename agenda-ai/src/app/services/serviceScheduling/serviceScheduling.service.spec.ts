import { TestBed } from "@angular/core/testing";
import { ServiceSchedulingService} from "./serviceScheduling.service";

describe('serviceSchedulingService', () => {
   let service: ServiceSchedulingService;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ServiceSchedulingService);
   });

   it('should be created', () => {
    expect(service).toBeTruthy();
   });

});