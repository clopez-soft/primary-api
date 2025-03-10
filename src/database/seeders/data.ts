import { ROLE_ACESS, USER_TYPE, ELECTORAL_LEVEL } from "src/common/enums";

import { RoleEntity } from "src/entities/security/role.entity";
import { UserEntity } from "src/entities/user.entity";

export type detailType = {
  sequence: number;
  movimiento?: string;
  alliance?: string;
};

export const getSeedRoles = async (): Promise<RoleEntity[]> => {
  const def = <RoleEntity>(<unknown>{
    name: "",
    description: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    access_level: 1,
    version: 1,
    updated_by: null,
    created_by: null,
    deleted_by: null,
    active: true,
    code: ROLE_ACESS.VIEWER,
    slug: "",
  });

  // return [];
  // return [ def ];
  return [
    {
      ...def,
      code: ROLE_ACESS.ROOT,
      name: "root",
      description: "super user",
      access_level: 100,
      slug: "root",
      updateSlug: () => {},
      createSlug: () => {},
    },
    {
      ...def,
      code: ROLE_ACESS.ADMIN,
      name: "administrator",
      description: "site administrator",
      access_level: 80,
      slug: "administrator",
      updateSlug: () => {},
      createSlug: () => {},
    },
    {
      ...def,
      code: ROLE_ACESS.SUPERVISOR,
      name: "supervisor",
      description: "supervisor",
      access_level: 60,
      slug: "supervisor",
      updateSlug: () => {},
      createSlug: () => {},
    },
    {
      ...def,
      code: ROLE_ACESS.DIGITIZER,
      name: "digitizer",
      description: "digitizer",
      access_level: 40,
      slug: "digitizer",
      updateSlug: () => {},
      createSlug: () => {},
    },
    {
      ...def,
      code: ROLE_ACESS.VIEWER,
      name: "viewer",
      description: "end user/viewer",
      access_level: 10,
      slug: "viewer",
      updateSlug: () => {},
      createSlug: () => {},
    },
  ];
};

export const getSeedUsers = async (
  rootRole: RoleEntity | null,
  adminRole: RoleEntity | null,
  digiRole: RoleEntity | null,
  viewRole: RoleEntity | null
): Promise<UserEntity[]> => {
  // const root1 = <UserEntity>{
  //   email: 'fab@conteo.com',
  //   password: '@fab.admin1*',
  //   name: 'Fabricio Maldonado',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  //   deleted_at: null,
  //   version: 1,
  //   updated_by: null,
  //   created_by: null,
  //   deleted_by: null,
  //   image_url: null,
  //   type: USER_TYPE.END_USER,
  //   active: true,
  //   role: rootRole,
  // };

  // const root2 = <UserEntity>{
  //   email: 'c.lopezh1288@gmail.com',
  //   password: 'May_2012*',
  //   name: 'Carlos Lopez',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  //   deleted_at: null,
  //   version: 1,
  //   updated_by: null,
  //   created_by: null,
  //   deleted_by: null,
  //   image_url: null,
  //   type: USER_TYPE.END_USER,
  //   active: true,
  //   role: rootRole,
  // };

  // const digi1 = <UserEntity>{
  //   email: 'digitalizador@conteo.com',
  //   password: '@digi.digi*',
  //   name: 'Digitalizador',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  //   deleted_at: null,
  //   version: 1,
  //   updated_by: null,
  //   created_by: null,
  //   deleted_by: null,
  //   image_url: null,
  //   type: USER_TYPE.END_USER,
  //   active: true,
  //   role: digiRole,
  // };

  const view1 = <UserEntity>(<unknown>{
    email: "carlos@conteo.com",
    password: "@carlos.admin*",
    name: "Carlos Luis",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    version: 1,
    updated_by: null,
    created_by: null,
    deleted_by: null,
    image_url: null,
    type: USER_TYPE.END_USER,
    active: true,
    role: adminRole,
  });

  return [view1];
};

export const getSeedCountry = () => {
  return [{ name: "Honduras", code: "HN" }];
};

export const getSeedDepartment = () => {
  return [{ name: "Yoro", code: "18", countryCode: "HN" }];
};

export const getSeedMunicipality = () => {
  return [
    { name: "Yoro", code: "1801", departmentCode: "18" },
    { name: "Arenal", code: "1802", departmentCode: "18" },
    { name: "El Negrito", code: "1803", departmentCode: "18" },
    { name: "El Progreso", code: "1804", departmentCode: "18" },
    { name: "Jocon", code: "1805", departmentCode: "18" },
    { name: "Morazan", code: "1806", departmentCode: "18" },
    { name: "Olanchito", code: "1807", departmentCode: "18" },
    { name: "Santa Rita", code: "1808", departmentCode: "18" },
    { name: "Sulaco", code: "1809", departmentCode: "18" },
    { name: "Victoria", code: "1810", departmentCode: "18" },
    { name: "Yorito", code: "1811", departmentCode: "18" },
  ];
};

export const getSeedMovimientoInterno = () => {
  return [
    {
      name: "FRP",
      code: "FRP",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_frp.png",
    },
    {
      name: "SOMOS+",
      code: "SOMOS+",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_somosmas.png",
    },
    {
      name: "POR",
      code: "POR",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_por.png",
    },
    {
      name: "NC",
      code: "NC",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_nc.png",
    },
    {
      name: "M28",
      code: "M28",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_m28.png",
    },
    {
      name: "MEL",
      code: "MEL",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_mel.png",
    },
    {
      name: "MORENA",
      code: "MORENA",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_morena.png",
    },
  ];
};

export const getSeedPoliticAlliance = () => {
  return [
    {
      name: "RIXI",
      code: "RIXI",
      movimientos_internos: ["FRP", "SOMOS+", "POR", "NC", "M28", "MEL"],
      level: ELECTORAL_LEVEL.PRESIDENT,
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_rixi.png",
    },
    {
      name: "UNIDAD",
      code: "UNIDAD",
      movimientos_internos: ["FRP", "POR"],
      level: ELECTORAL_LEVEL.MAYOR,
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_unidad_alcalde.png",
    },
    {
      name: "UNIDAD",
      code: "UNIDAD",
      movimientos_internos: ["FRP", "POR", "SOMOS+"],
      level: ELECTORAL_LEVEL.CONGRESS,
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/flags/flag_unidad_congreso.png",
    },
  ];
};

export const getSeedBallotPresident = () => {
  const detail: detailType[] = [
    { sequence: 1, movimiento: undefined, alliance: "RIXI" },
    { sequence: 2, movimiento: "MORENA" },
  ];
  return [
    {
      level: ELECTORAL_LEVEL.PRESIDENT,
      country_code: "HN",
      marks: 1,
      name: "Presidente",
      detail: detail,
    },
  ];
};

export const getSeedBallotCongress = () => {
  const detail: detailType[] = [
    { sequence: 1, movimiento: "NC" },
    { sequence: 2, alliance: "UNIDAD" },
    { sequence: 3, movimiento: "MEL" },
    { sequence: 4, movimiento: "MORENA" },
    { sequence: 5, movimiento: "M28" },
  ];
  return [
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      marks: 9,
      name: "Diputados Yoro",
      detail: detail,
    },
  ];
};

export const getSeedBallotMayor = () => {
  const detail: detailType[] = [
    { sequence: 1, movimiento: "NC" },
    { sequence: 2, movimiento: "SOMOS+" },
    { sequence: 3, movimiento: "MEL" },
    { sequence: 4, movimiento: "MORENA" },
    { sequence: 5, alliance: "UNIDAD" },
    { sequence: 6, movimiento: "M28" },
  ];
  return [
    {
      level: ELECTORAL_LEVEL.MAYOR,
      municipality_code: "1804",
      marks: 1,
      name: "Alcaldes El Progreso Yoro",
      detail: detail,
    },
  ];
};

export const getSeedCandidatePresident = () => {
  return [
    {
      level: ELECTORAL_LEVEL.PRESIDENT,
      country_code: "HN",
      alliance: "RIXI",
      code: "1",
      box_number: 1,
      name: "Rixi Moncada",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_rixi.png",
    },
    {
      level: ELECTORAL_LEVEL.PRESIDENT,
      country_code: "HN",
      movimiento: "MORENA",
      code: "2",
      box_number: 2,
      name: "Rasel Tome",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_rasel.png",
    },
  ];
};

export const getSeedCandidateMayor = () => {
  return [
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      movimiento: "NC",
      code: "1",
      box_number: 1,
      name: "Eduardo Diaz",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_eduardo_diaz.png",
    },
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      movimiento: "SOMOS+",
      code: "2",
      box_number: 2,
      name: "Merlin Bonilla",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_merlin_bonilla.png",
    },
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      movimiento: "MEL",
      code: "3",
      box_number: 3,
      name: "Elvin Borjas",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_elvin_borjas.png",
    },
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      movimiento: "MORENA",
      code: "4",
      box_number: 4,
      name: "Alma Enamorado",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_alma_enamorado.png",
    },
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      alliance: "UNIDAD",
      code: "5",
      box_number: 5,
      name: "Adan Palacios",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_adan_palacios.png",
    },
    {
      level: ELECTORAL_LEVEL.MAYOR,
      country_code: "HN",
      municipality_code: "1804",
      movimiento: "M28",
      code: "6",
      box_number: 6,
      name: "Joel Almendarez",
      image_url:
        "https://electoral-primary-yoro.nyc3.digitaloceanspaces.com/candidates/img_joel_almendares.png",
    },
  ];
};

export const getSeedCandidateCongress = () => {
  return [
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "1",
      box_number: 1,
      name: "Pedro Reyes",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "2",
      box_number: 2,
      name: "Julia Ortiz",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "3",
      box_number: 3,
      name: "Lino Martinez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "4",
      box_number: 4,
      name: "Sandra Castro",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "5",
      box_number: 5,
      name: "Dionisio Romero",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "6",
      box_number: 6,
      name: "Marthali Ulloa",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "7",
      box_number: 7,
      name: "Reynieri Godoy",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "8",
      box_number: 8,
      name: "Lilian Bardales",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "NC",
      code: "9",
      box_number: 9,
      name: "Renan Rivera",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },

    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "10",
      box_number: 10,
      name: "Bartolo Fuentes",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "11",
      box_number: 11,
      name: "Delmy Soto",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "12",
      box_number: 12,
      name: "Salvador Oseguera",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "13",
      box_number: 13,
      name: "Helin Pavon",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "14",
      box_number: 14,
      name: "Oskar Maldonado",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "15",
      box_number: 15,
      name: "Maria Colindres",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "16",
      box_number: 16,
      name: "Jorge Alvarado",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "17",
      box_number: 17,
      name: "Suani Martinez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      alliance: "UNIDAD",
      code: "18",
      box_number: 18,
      name: "Mario Murcia",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },

    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "19",
      box_number: 19,
      name: "Francisco Lazo",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "20",
      box_number: 20,
      name: "Wendy Valerio",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "21",
      box_number: 21,
      name: "Neptali Recarte",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "22",
      box_number: 22,
      name: "Karla Martinez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "23",
      box_number: 23,
      name: "German Ucles",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "24",
      box_number: 24,
      name: "Reyna Leon",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "25",
      box_number: 25,
      name: "Jeyson Orellana",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "26",
      box_number: 26,
      name: "Yahaira Ramos",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MEL",
      code: "27",
      box_number: 27,
      name: "Javier Falcon",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },

    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "28",
      box_number: 28,
      name: "Luis Posas",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "29",
      box_number: 29,
      name: "Catalina Cordova",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "30",
      box_number: 30,
      name: "Jeronimo Carranza",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "31",
      box_number: 31,
      name: "Neivy Fuentes",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "32",
      box_number: 32,
      name: "Jose Giron",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "33",
      box_number: 33,
      name: "Maria Benitez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "34",
      box_number: 34,
      name: "Hector Flores",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "35",
      box_number: 35,
      name: "Yolanda Hernandez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "MORENA",
      code: "36",
      box_number: 36,
      name: "Denis Guitierrez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },

    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "37",
      box_number: 37,
      name: "Felipe Ponce",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "38",
      box_number: 38,
      name: "Melbi Ortiz",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "39",
      box_number: 39,
      name: "Oscar Bustillo",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "40",
      box_number: 40,
      name: "Araminta Pereira",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "41",
      box_number: 41,
      name: "Carlos Diaz",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "42",
      box_number: 42,
      name: "Jennifer Diaz",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "43",
      box_number: 43,
      name: "Victor Matamoros",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "44",
      box_number: 44,
      name: "Zarvia Amaya",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
    {
      level: ELECTORAL_LEVEL.CONGRESS,
      department_code: "18",
      movimiento: "M28",
      code: "45",
      box_number: 45,
      name: "Edgard Martinez",
      // image_url:
      //   "https://electoral-count.nyc3.digitaloceanspaces.com/candiatos/julio-lopez.png",
    },
  ];
};
