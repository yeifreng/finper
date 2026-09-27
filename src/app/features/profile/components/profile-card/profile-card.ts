import { Component, input, output } from '@angular/core';
import { ProfileInterface } from '../../interfaces/ProfileInterface.interface';

@Component({
  selector: 'app-profile-card',
  imports: [],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {

  readonly profile = input.required<ProfileInterface>();
  readonly activeSection = input.required<'profile' | 'security'>();

  readonly sectionChange = output<'profile' | 'security'>();

}
