import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'page-candidat',
  templateUrl: './page-candidat.html',
})
export class pageCandidat {
  public routes = routes;

  constructor(private router: Router
  ) { }

}
