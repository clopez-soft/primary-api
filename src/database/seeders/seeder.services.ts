import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager, DataSource } from "typeorm";
//import { sentenceCase } from "change-case";

import { RoleEntity } from "src/entities/security/role.entity";
import { UserEntity } from "src/entities/user.entity";
import { CountryEntity } from "src/entities/locations/country.entity";
import { DepartmentEntity } from "src/entities/locations/department.entity";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { BallotEntity } from "src/entities/ballot/ballot.entity";
import { BallotDetailEntity } from "src/entities/ballot/ballot-detail.entity";
import { CandidateEntity } from "src/entities/candidate.entity";

import {
  getSeedRoles,
  getSeedUsers,
  getSeedCountry,
  getSeedDepartment,
  getSeedMunicipality,
  getSeedMovimientoInterno,
  getSeedCandidateMayor,
  getSeedCandidateCongress,
} from "src/database/seeders/data";
import { ELECTORAL_LEVEL, ROLE_ACESS } from "src/common/enums";
import {
  getSeedPoliticAlliance,
  getSeedBallotPresident,
  getSeedBallotCongress,
  getSeedBallotMayor,
  getSeedCandidatePresident,
} from "./data";

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,

    @InjectRepository(MunicipalityEntity)
    private readonly municipalityRepository: Repository<MunicipalityEntity>,

    @InjectRepository(MovimientoInternoEntity)
    private readonly MovimientoInternoRepository: Repository<MovimientoInternoEntity>,

    @InjectRepository(PoliticalAllianceEntity)
    private readonly PoliticalAllianceRepository: Repository<PoliticalAllianceEntity>,

    @InjectRepository(BallotEntity)
    private readonly BallotRepository: Repository<BallotEntity>,

    @InjectRepository(BallotDetailEntity)
    private readonly BallotDetailRepository: Repository<BallotDetailEntity>,

    @InjectRepository(CandidateEntity)
    private readonly CandidateRepository: Repository<CandidateEntity>,

    private readonly dataSource: DataSource
  ) {}

  async createRoles() {
    console.info("--- creating roles ---");

    const roles = await getSeedRoles();
    for (const role of roles) {
      const dbItem = await this.roleRepository.findOne({
        where: { code: role.code, active: true },
      });
      if (dbItem) {
        console.log(`   role : ${role.code} already exist`);
        continue;
      }

      try {
        const newItem = this.roleRepository.create(role);
        newItem.code = role.code;
        newItem.name = role.name;
        newItem.description = role.description;
        newItem.access_level = role.access_level;

        const saved = await this.roleRepository.save(newItem);
        console.log(`   role : ${saved.code} created`);
      } catch (error) {
        console.log(`Could not create role : ${role.code}`);
        console.log(`Could not create role : ${error}`);
      }
    }
  }

  async createUsers() {
    console.info("--- creating users ---");

    const rootRole = await this.roleRepository.findOne({
      where: { code: ROLE_ACESS.ROOT, active: true },
    });
    const adminRole = await this.roleRepository.findOne({
      where: { code: ROLE_ACESS.ADMIN, active: true },
    });

    const digitizarRole = await this.roleRepository.findOne({
      where: { code: ROLE_ACESS.DIGITIZER, active: true },
    });
    const ViewerRole = await this.roleRepository.findOne({
      where: { code: ROLE_ACESS.VIEWER, active: true },
    });

    const users = await getSeedUsers(
      rootRole,
      adminRole,
      digitizarRole,
      ViewerRole
    );
    for (const user of users) {
      const dbUser = await this.userRepository.findOne({
        where: { email: user.email, active: true },
      });
      if (dbUser) {
        console.log(
          `%c user : ${user.name} already exist`,
          "background:orange; color:white"
        );
        continue;
      }

      try {
        const newUser = this.userRepository.create(user);
        newUser.confirmed = true;
        const saved = await this.userRepository.save(newUser);
        console.log(
          `%c  user : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create user : ${user.email}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createCountry() {
    console.info("--- creating country ---");

    const countries = getSeedCountry();
    for (const country of countries) {
      try {
        const dbCountry = await this.countryRepository.findOne({
          where: { code: country.code },
        });
        if (dbCountry) {
          console.log(
            `%c country : ${country.name} already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newCountry = this.countryRepository.create(country);
        const saved = await this.countryRepository.save(newCountry);
        console.log(
          `%c country : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create country : ${country.name}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createDepartment() {
    console.info("--- creating department ---");

    const departments = getSeedDepartment();
    for (const department of departments) {
      try {
        const dbCountry = await this.countryRepository.findOne({
          where: { code: department.countryCode },
        });
        if (!dbCountry) {
          console.log(
            `%c country : ${department.countryCode} not exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const dbdepartment = await this.departmentRepository.findOne({
          where: { code: department.code },
        });
        if (dbdepartment) {
          console.log(
            `%c department : ${dbdepartment.name} already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newDepartment = this.departmentRepository.create(department);
        newDepartment.country = dbCountry;

        const saved = await this.departmentRepository.save(newDepartment);
        console.log(
          `%c department : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create department : ${department.name}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createMunicipality() {
    console.info("--- creating municipality ---");

    const municipalities = getSeedMunicipality();
    for (const municipality of municipalities) {
      try {
        const dbDepartment = await this.departmentRepository.findOne({
          where: { code: municipality.departmentCode },
        });
        if (!dbDepartment) {
          console.log(
            `%c department : ${municipality.departmentCode} not exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const dbMunicipality = await this.municipalityRepository.findOne({
          where: { code: municipality.code },
        });
        if (dbMunicipality) {
          console.log(
            `%c municipality : ${municipality.name} already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newMunicipality =
          this.municipalityRepository.create(municipality);
        newMunicipality.department = dbDepartment;

        const saved = await this.municipalityRepository.save(newMunicipality);
        console.log(
          `%c municipality : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create municipality : ${municipality.name}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createMovimientoInterno() {
    console.info("--- creating politic party ---");

    const politicParties = getSeedMovimientoInterno();
    for (const politicParty of politicParties) {
      try {
        const dbParty = await this.MovimientoInternoRepository.findOne({
          where: { code: politicParty.code },
        });
        if (dbParty) {
          console.log(
            `%c politic party : ${politicParty.name} already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newPoliticParty =
          this.MovimientoInternoRepository.create(politicParty);
        const saved =
          await this.MovimientoInternoRepository.save(newPoliticParty);
        console.log(
          `%c politic party : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create politic party : ${politicParty.name}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createAlliances() {
    console.info("--- creating politic alliance ---");

    const politicAlliances = getSeedPoliticAlliance();
    for (const alliance of politicAlliances) {
      try {
        const dbAlliance = await this.PoliticalAllianceRepository.findOne({
          where: { code: alliance.code, level: alliance.level },
        });
        if (dbAlliance) {
          console.log(
            `%c politic alliance : ${alliance.name} already exist. ${alliance.level}`,
            "background:orange; color:white"
          );
          continue;
        }

        const newPoliticAlliance =
          this.PoliticalAllianceRepository.create(alliance);
        const saved =
          await this.PoliticalAllianceRepository.save(newPoliticAlliance);
        console.log(
          `%c politic alliance : ${saved.name} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create politic alliance : ${alliance.name}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createBallotPresident() {
    console.info("--- creating Ballot President ---");

    const ballots = getSeedBallotPresident();
    for (const ballot of ballots) {
      try {
        const country = await this.countryRepository.findOne({
          where: { code: ballot.country_code },
        });
        if (!country) {
          console.log(
            `%c country : ${ballot.country_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbBallot = await this.BallotRepository.findOne({
          where: { level: ballot.level, country: country },
        });
        if (dbBallot) {
          console.log(
            `%c ballot : ${ballot.level} - ${ballot.country_code} already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newBallot = this.BallotRepository.create(ballot);

        newBallot.country = country;
        const ballotDetail: BallotDetailEntity[] = [];
        for (const detail of ballot.detail) {
          const newDetail = this.BallotDetailRepository.create();

          if (detail.movimiento) {
            const movimiento = await this.MovimientoInternoRepository.findOne({
              where: { code: detail.movimiento },
            });
            if (!movimiento) {
              console.log(
                `%c party : ${detail.movimiento} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.movimiento_interno = movimiento;
          }

          if (detail.alliance) {
            const alliance = await this.PoliticalAllianceRepository.findOne({
              where: { code: detail.alliance, level: ballot.level },
            });
            if (!alliance) {
              console.log(
                `%c alliance : ${detail.alliance} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.political_alliance = alliance;
          }

          newDetail.ballot = newBallot;
          newDetail.sequence = detail.sequence;
          ballotDetail.push(newDetail);
        }

        console.log(`Tratando de guardar la boleta: ${newBallot.level}`);
        //console.dir(ballotDetail);
        // const savedItem = await getManager().transaction(
        //   async (transactionalEntityManager) => {
        //     const save = await transactionalEntityManager.save(newBallot);
        //     await transactionalEntityManager.save(ballotDetail);
        //     return save;
        //   }
        // );

        const savedItem = await this.dataSource.transaction(async (manager) => {
          const save = await manager.save(newBallot);
          await manager.save(ballotDetail);
          return save;
        });

        console.log(
          `%c ballot : ${savedItem.level} - ${savedItem.country.code} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.error(error);
        console.log(
          `%c Could not create ballot : ${ballot.level} - ${ballot.country_code}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createBallotCongress() {
    console.info("--- creating Ballot Congress ---");

    const ballots = getSeedBallotCongress();
    for (const ballot of ballots) {
      try {
        const deparment = await this.departmentRepository.findOne({
          where: { code: ballot.department_code },
        });
        if (!deparment) {
          console.log(
            `%c deparment : ${ballot.department_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbBallot = await this.BallotRepository.findOne({
          where: { level: ballot.level, department: deparment },
        });
        if (dbBallot) {
          console.log(
            `%c ballot : ${ballot.level} - ${ballot.department_code}  already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newBallot = this.BallotRepository.create(ballot);
        newBallot.department = deparment;

        const ballotDetail: BallotDetailEntity[] = [];
        for (const detail of ballot.detail) {
          const newDetail = this.BallotDetailRepository.create();

          if (detail.movimiento) {
            const party = await this.MovimientoInternoRepository.findOne({
              where: { code: detail.movimiento },
            });
            if (!party) {
              console.log(
                `%c party : ${detail.movimiento} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.movimiento_interno = party;
          }

          if (detail.alliance) {
            const alliance = await this.PoliticalAllianceRepository.findOne({
              where: { code: detail.alliance, level: ballot.level },
            });
            if (!alliance) {
              console.log(
                `%c alliance : ${detail.alliance} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.political_alliance = alliance;
          }

          newDetail.ballot = newBallot;
          newDetail.sequence = detail.sequence;
          ballotDetail.push(newDetail);
        }

        console.log(`Tratando de guardar la boleta: ${newBallot.level}`);
        // console.dir(ballotDetail);
        // const savedItem = await getManager().transaction(
        //   async (transactionalEntityManager) => {
        //     const save = await transactionalEntityManager.save(newBallot);
        //     await transactionalEntityManager.save(ballotDetail);
        //     return save;
        //   }
        // );

        const savedItem = await this.dataSource.transaction(async (manager) => {
          const save = await manager.save(newBallot);
          await manager.save(ballotDetail);
          return save;
        });

        console.log(
          `%c ballot : ${savedItem.level} - ${savedItem.department.code} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.error(error);
        console.log(
          `%c Could not create ballot : ${ballot.level} - ${ballot.department_code}`,
          "background:red; color:white"
        );
        continue;
      }
    }
  }

  async createBallotMayor() {
    console.info("--- creating Ballot Mayor ---");

    const ballots = getSeedBallotMayor();
    for (const ballot of ballots) {
      try {
        const municipality = await this.municipalityRepository.findOne({
          where: { code: ballot.municipality_code },
        });
        if (!municipality) {
          console.log(
            `%c municipality : ${ballot.municipality_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbBallot = await this.BallotRepository.findOne({
          where: { level: ballot.level, municipality: municipality },
        });
        if (dbBallot) {
          console.log(
            `%c ballot : ${ballot.level} - ${ballot.municipality_code}  already exist`,
            "background:orange; color:white"
          );
          continue;
        }

        const newBallot = this.BallotRepository.create(ballot);
        newBallot.municipality = municipality;

        const ballotDetail: BallotDetailEntity[] = [];
        for (const detail of ballot.detail) {
          const newDetail = this.BallotDetailRepository.create();

          if (detail.movimiento) {
            const party = await this.MovimientoInternoRepository.findOne({
              where: { code: detail.movimiento },
            });
            if (!party) {
              console.log(
                `%c party : ${detail.movimiento} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.movimiento_interno = party;
          }

          if (detail.alliance) {
            const stralliance = detail.alliance as string;
            const alliance = await this.PoliticalAllianceRepository.findOne({
              where: { code: stralliance, level: ballot.level },
            });
            if (!alliance) {
              console.log(
                `%c alliance : ${stralliance} not exist`,
                "background:orange; color:white"
              );
              continue;
            }

            newDetail.political_alliance = alliance;
          }

          newDetail.ballot = newBallot;
          newDetail.sequence = detail.sequence;
          ballotDetail.push(newDetail);
        }

        console.log(`Tratando de guardar la boleta: ${newBallot.level}`);
        // console.dir(ballotDetail);
        // const savedItem = await getManager().transaction(
        //   async (transactionalEntityManager) => {
        //     const save = await transactionalEntityManager.save(newBallot);
        //     await transactionalEntityManager.save(ballotDetail);
        //     return save;
        //   }
        // );

        const savedItem = await this.dataSource.transaction(async (manager) => {
          const save = await manager.save(newBallot);
          await manager.save(ballotDetail);
          return save;
        });

        console.log(
          `%c ballot : ${savedItem.level} - ${savedItem.municipality.code} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.error(error);
        console.log(
          `%c Could not create ballot : ${ballot.level} - ${ballot.municipality_code}`,
          "background:red; color:white"
        );
        console.log(`%c error : ${error}`, "background:red; color:white");
        continue;
      }
    }
  }

  async createCandidatesPresident() {
    console.info("--- creating Candidates President ---");
    const candidates = getSeedCandidatePresident();
    for (const candidate of candidates) {
      try {
        const country = await this.countryRepository.findOne({
          where: { code: candidate.country_code },
        });
        if (!country) {
          console.log(
            `%c country : ${candidate.country_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbCandidate = await this.CandidateRepository.findOne({
          where: {
            level: candidate.level,
            box_number: candidate.box_number,
            country: country,
          },
        });
        if (dbCandidate) {
          console.log(
            `%c candidate : ${candidate.level} - ${candidate.box_number} - ${candidate.country_code} already exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const tempNew = {
          name: candidate.name,
          code: `${candidate.box_number}`,
          box_number: candidate.box_number,
          level: candidate.level,
          image_url: candidate.image_url,
          country: country,
        };
        const newCandidate = this.CandidateRepository.create(tempNew);
        if (candidate.movimiento) {
          const party = await this.MovimientoInternoRepository.findOne({
            where: { code: candidate.movimiento },
          });
          if (!party) {
            console.log(
              `%c party : ${candidate.movimiento} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.movimiento_interno = party;
        }

        if (candidate.alliance) {
          const alliance = await this.PoliticalAllianceRepository.findOne({
            where: { code: candidate.alliance, level: candidate.level },
          });
          if (!alliance) {
            console.log(
              `%c alliance : ${candidate.alliance} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.political_alliance = alliance;
        }

        const saved = await this.CandidateRepository.save(newCandidate);
        console.log(
          `%c candidate: ${saved.level} - box ${saved.box_number} created`,
          "background:white; color:green"
        );
        continue;
      } catch (error) {
        console.log(
          `%c Could not create candidate: ${candidate.level} - box ${candidate.box_number}`,
          "background:red; color:white"
        );
        console.log(`%c error : ${error}`, "background:red; color:white");
        continue;
      }
    }
  }

  async createCandidatesCongress() {
    console.info("--- creating Candidates Congress ---");
    const candidates = getSeedCandidateCongress();
    for (const candidate of candidates) {
      try {
        const department = await this.departmentRepository.findOne({
          where: { code: candidate.department_code },
        });
        if (!department) {
          console.log(
            `%c department : ${candidate.department_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbCandidate = await this.CandidateRepository.findOne({
          where: {
            level: candidate.level,
            box_number: candidate.box_number,
            department: department,
          },
          relations: ["department"],
        });
        if (dbCandidate) {
          console.log(
            `%c candidate : ${candidate.level} - ${candidate.box_number} - ${candidate.department_code} already exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const tempNew = {
          name: candidate.name,
          code: `${candidate.box_number}`,
          box_number: candidate.box_number,
          level: candidate.level,
          // image_url: candidate.image_url || "",
          department: department,
        };
        const newCandidate = this.CandidateRepository.create(tempNew);
        if (candidate.movimiento) {
          const movimiento = await this.MovimientoInternoRepository.findOne({
            where: { code: candidate.movimiento },
          });
          if (!movimiento) {
            console.log(
              `%c movimiento : ${candidate.movimiento} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.movimiento_interno = movimiento;
        }

        if (candidate.alliance) {
          const alliance = await this.PoliticalAllianceRepository.findOne({
            where: { code: candidate.alliance, level: candidate.level },
          });
          if (!alliance) {
            console.log(
              `%c alliance : ${candidate.alliance} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.political_alliance = alliance;
        }
        const saved = await this.CandidateRepository.save(newCandidate);
        console.log(
          `%c candidate: ${saved.level} - box ${saved.box_number} created`,
          "background:white; color:green"
        );
      } catch (error) {
        console.log(
          `%c Could not create candidate: ${candidate.level} - box ${candidate.box_number}`,
          "background:red; color:white"
        );
        console.log(`%c error : ${error}`, "background:red; color:white");
        continue;
      }
    }

    //-------- ORIGINAL--------
    // try {
    //   const ballots = await this.BallotRepository.find({
    //     where: { level: ELECTORAL_LEVEL.CONGRESS },
    //     relations: ["department"],
    //   });
    //   //let boxNumber = 1;
    //   for (const ballot of ballots) {
    //     const detailBallot = await this.BallotDetailRepository.find({
    //       where: { ballot: ballot },
    //       relations: ["movimiento_interno", "political_alliance"],
    //     });
    //     console.log(
    //       `%c creating : ${ballot.level} - ${ballot.department}`,
    //       "background:orange; color:white"
    //     );
    //     for (const detail of detailBallot) {
    //       try {
    //         console.log(
    //           `%c creating sequence: ${detail.sequence}`,
    //           "background:orange; color:white"
    //         );
    //         const newCandidates: CandidateEntity[] = [];
    //         for (let i = 1; i <= ballot.marks; i++) {
    //           const boxNumber = (detail.sequence - 1) * ballot.marks + i;
    //           const dbCandidate = await this.CandidateRepository.findOne({
    //             where: {
    //               box_number: boxNumber,
    //               level: ballot.level,
    //               department: ballot.department,
    //             },
    //             relations: ["department"],
    //           });
    //           if (dbCandidate) {
    //             console.log(
    //               `%c candidate : ${dbCandidate.level} - ${dbCandidate.box_number} - ${dbCandidate.department.code} already exist`,
    //               "background:orange; color:white"
    //             );
    //             continue;
    //           }
    //           const tempNew = {
    //             code: `${boxNumber}`,
    //             box_number: boxNumber,
    //             level: ballot.level,
    //             department: ballot.department,
    //             movimiento_interno: detail.movimiento_interno,
    //             political_alliance: detail.political_alliance,
    //           };
    //           console.log(
    //             `%c creating boxNumber: ${boxNumber}`,
    //             "background:orange; color:white"
    //           );
    //           //boxNumber++
    //           const newCandidate = this.CandidateRepository.create(tempNew);
    //           newCandidates.push(newCandidate);
    //         }
    //         await this.CandidateRepository.save(newCandidates);
    //         console.log(
    //           `%c candidates: ${ballot.level} - ${ballot.department.code} - ${detail.sequence}  created`,
    //           "background:white; color:green"
    //         );
    //         continue;
    //       } catch (error) {
    //         console.log(
    //           `%c Could not create candidate: ${ballot.level} - box ${ballot.department.code}`,
    //           "background:red; color:white"
    //         );
    //         console.log(`%c error : ${error}`, "background:red; color:white");
    //         continue;
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(`%c error : ${error}`, "background:red; color:white");
    // }
  }

  async createCandidatesMayor() {
    console.info("--- creating Candidates Mayor ---");
    const candidates = getSeedCandidateMayor();
    for (const candidate of candidates) {
      try {
        const municipality = await this.municipalityRepository.findOne({
          where: { code: candidate.municipality_code },
        });
        if (!municipality) {
          console.log(
            `%c municipality : ${candidate.municipality_code} not exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const dbCandidate = await this.CandidateRepository.findOne({
          where: {
            level: candidate.level,
            box_number: candidate.box_number,
            municipality: municipality,
          },
          relations: ["municipality"],
        });
        if (dbCandidate) {
          console.log(
            `%c candidate : ${candidate.level} - ${candidate.box_number} - ${candidate.country_code} already exist`,
            "background:orange; color:white"
          );
          continue;
        }
        const tempNew = {
          name: candidate.name,
          code: `${candidate.box_number}`,
          box_number: candidate.box_number,
          level: candidate.level,
          image_url: candidate.image_url,
          municipality: municipality,
        };
        const newCandidate = this.CandidateRepository.create(tempNew);
        if (candidate.movimiento) {
          const movimiento = await this.MovimientoInternoRepository.findOne({
            where: { code: candidate.movimiento },
          });
          if (!movimiento) {
            console.log(
              `%c movimiento : ${candidate.movimiento} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.movimiento_interno = movimiento;
        }

        if (candidate.alliance) {
          const alliance = await this.PoliticalAllianceRepository.findOne({
            where: { code: candidate.alliance, level: candidate.level },
          });
          if (!alliance) {
            console.log(
              `%c alliance : ${candidate.alliance} not exist`,
              "background:orange; color:white"
            );
            continue;
          }
          newCandidate.political_alliance = alliance;
        }
        const saved = await this.CandidateRepository.save(newCandidate);
        console.log(
          `%c candidate: ${saved.level} - box ${saved.box_number} created`,
          "background:white; color:green"
        );
      } catch (error) {
        console.log(
          `%c Could not create candidate: ${candidate.level} - box ${candidate.box_number}`,
          "background:red; color:white"
        );
        console.log(`%c error : ${error}`, "background:red; color:white");
        continue;
      }
    }

    //---------------------ORIGINAL---------
    // try {
    //   const ballots = await this.BallotRepository.find({
    //     where: { level: ELECTORAL_LEVEL.MAYOR },
    //     relations: ["municipality"],
    //   });
    //   //let boxNumber = 1;
    //   for (const ballot of ballots) {
    //     const detailBallot = await this.BallotDetailRepository.find({
    //       where: { ballot: ballot },
    //       relations: ["movimiento_interno", "political_alliance"],
    //     });
    //     console.log(
    //       `%c creating : ${ballot.level} - ${ballot.municipality.code}`,
    //       "background:orange; color:white"
    //     );
    //     for (const detail of detailBallot) {
    //       try {
    //         console.log(
    //           `%c creating sequence: ${ballot.level} - ${ballot.municipality.code} - ${detail.sequence}`,
    //           "background:orange; color:white"
    //         );

    //         const boxNumber = detail.sequence;
    //         const dbCandidate = await this.CandidateRepository.findOne({
    //           where: {
    //             box_number: boxNumber,
    //             level: ballot.level,
    //             municipality: ballot.municipality,
    //           },
    //           relations: ["municipality"],
    //         });
    //         if (dbCandidate) {
    //           console.log(
    //             `%c candidate : ${dbCandidate.level} - ${dbCandidate.box_number} - ${dbCandidate.municipality.code} already exist`,
    //             "background:orange; color:white"
    //           );
    //           continue;
    //         }
    //         const tempNew = {
    //           code: `${boxNumber}`,
    //           box_number: boxNumber,
    //           level: ballot.level,
    //           municipality: ballot.municipality,
    //           movimiento_interno: detail.movimiento_interno,
    //           political_alliance: detail.political_alliance,
    //         };
    //         //console.log(`%c creating boxNumber: ${boxNumber}`, 'background:orange; color:white');
    //         //boxNumber++
    //         const newCandidate = this.CandidateRepository.create(tempNew);
    //         await this.CandidateRepository.save(newCandidate);
    //         console.log(
    //           `%c candidates: ${ballot.level} - ${ballot.municipality.code} - ${detail.sequence}  created`,
    //           "background:white; color:green"
    //         );
    //         continue;
    //       } catch (error) {
    //         console.log(
    //           `%c Could not create candidate: ${ballot.level} - box ${ballot.municipality.code}`,
    //           "background:red; color:white"
    //         );
    //         console.log(`%c error : ${error}`, "background:red; color:white");
    //         continue;
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(`%c error : ${error}`, "background:red; color:white");
    // }
  }
}
