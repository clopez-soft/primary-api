import { Injectable } from "@nestjs/common";
import { SeederService } from "./seeder.services";

@Injectable()
export class Seeder {
  constructor(private readonly seederService: SeederService) {}

  async seed() {
    try {
      // await this.seederService.createRoles().then(async () => {
      //   await this.seederService.createUsers();
      // });
      // await this.seederService.createCountry();
      // await this.seederService.createDepartment();
      // await this.seederService.createMunicipality();
      // await this.seederService.createMovimientoInterno();
      // await this.seederService.createAlliances();
      // await this.seederService.createBallotPresident();
      // await this.seederService.createBallotCongress();
      // await this.seederService.createBallotMayor();
      await this.seederService.createCandidatesPresident();
      await this.seederService.createCandidatesCongress();
      await this.seederService.createCandidatesMayor();
      console.info("Seeding complete!");
    } catch (error) {
      console.error("Error at seed proccess : ", error);
    }
  }
}
