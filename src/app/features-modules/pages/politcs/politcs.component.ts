import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './politcs.component.html',
  styleUrls: ['./politcs.component.scss']
})
export class PolitcsComponent {
  public routes = routes;
 
}
