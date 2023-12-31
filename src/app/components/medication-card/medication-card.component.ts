import { MedicationsService } from './../../services/medications.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImagePreloader } from 'src/app/directives/image-preloader.directive';
import { Medication } from 'src/app/models/medication';
export interface MedicationWithPicture extends Medication {
  picture?: string;
}
@Component({
  selector: 'app-medication-card',
  templateUrl: './medication-card.component.html',
  styleUrls: ['./medication-card.component.scss'],
  imports: [IonicModule, CommonModule, ImagePreloader],
  standalone: true,
})
export class MedicationCardComponent implements OnInit {
  @Input() medication: MedicationWithPicture = {} as MedicationWithPicture;
  gotMedicationPicturesCache: { [key: string]: string } = {};
  constructor(private MedicationsService: MedicationsService) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    const medicationInput: Medication = changes['medication'].currentValue;
    if (medicationInput) {
      this.getMedicationPicture(medicationInput);
    }
  }

  async getMedicationPicture(medication: Medication) {
    if (this.gotMedicationPicturesCache[medication.id]) {
      this.medication.picture = this.gotMedicationPicturesCache[medication.id];
      return this.medication.picture;
    }
    const medicationPictureURL =
      await this.MedicationsService.getMedicationPicture(medication);
    if (typeof medicationPictureURL === 'string') {
      this.medication.picture = medicationPictureURL;
    } else {
      this.medication.picture = '';
    }
    this.gotMedicationPicturesCache[medication.id] = this.medication.picture;
    return this.medication.picture;
  }

  setDefaultPicture() {
    this.medication.picture = 'assets/img/medication-placeholder.webp';
  }
}
