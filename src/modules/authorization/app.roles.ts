import { ROLE_ACESS } from "src/common/enums";
import { RolesBuilder } from "./ac-options";

export const roles: RolesBuilder = new RolesBuilder();

roles
  //! set VIEWER permissions
  .grant(ROLE_ACESS.VIEWER)
  .readAny("country")
  .readAny("department")
  .readAny("municipality")
  .readAny("voting-center")
  .readAny("jrv")
  .readAny("ballot")
  .readAny("record")
  .readAny("candidate")
  .readAny("movimiento-interno")
  .readAny("political-alliance")
  .readAny("voting-center-enums")
  .readAny("record-enums")
  .readAny("record")

  //! set DIGITIZER permissions
  .grant(ROLE_ACESS.DIGITIZER)
  .extend(ROLE_ACESS.VIEWER)
  .createAny("record")
  .updateAny()
  .deleteAny()

  //! set ADMIN permissions
  .grant(ROLE_ACESS.ADMIN)
  .extend(ROLE_ACESS.DIGITIZER)
  .createAny("country")
  .updateAny()
  .deleteAny()
  .createAny("department")
  .updateAny()
  .deleteAny()
  .createAny("municipality")
  .updateAny()
  .deleteAny()
  .createAny("voting-center")
  .updateAny()
  .deleteAny()
  .createAny("candidate")
  .updateAny()
  .deleteAny()
  .createAny("movimiento-interno")
  .updateAny()
  .deleteAny()
  .createAny("political-alliance")
  .updateAny()
  .deleteAny()
  .createAny("ballot")
  .updateAny()
  .deleteAny()
  .createAny("jrv")
  .updateAny()
  .deleteAny()
  .readAny("user")
  .updateAny("user-role")

  //! set ROOT permissions
  .grant(ROLE_ACESS.ROOT)
  .extend(ROLE_ACESS.ADMIN)
  .createAny("user")
  .updateAny()
  .deleteAny();
