import { ROLE_ACESS } from "src/common/enums";

export const digitizer_menu = {
  role: ROLE_ACESS.DIGITIZER,
  menu: [{ name: "record", inherit: true }],
};

export const viewer_menu = {
  role: ROLE_ACESS.VIEWER,
  menu: [
    ...digitizer_menu.menu.filter((i) => i.inherit),
    { name: "dashboard", inherit: true },
    { name: "result-president", inherit: true },
    { name: "result-mayor", inherit: true },
    { name: "result-congress", inherit: true },
  ],
};

export const supervisor_menu = {
  role: ROLE_ACESS.SUPERVISOR,
  menu: [
    ...viewer_menu.menu.filter((i) => i.inherit),
    { name: "audit", inherit: true },
  ],
};

export const admin_menu = {
  role: ROLE_ACESS.ADMIN,
  menu: [
    ...supervisor_menu.menu.filter((i) => i.inherit),
    { name: "country", inherit: true },
    { name: "department", inherit: true },
    { name: "municipality", inherit: true },
    { name: "voting-center", inherit: true },
    { name: "candidate", inherit: true },
    { name: "movimiento-interno", inherit: true },
    { name: "political-alliance", inherit: true },
    { name: "ballot", inherit: true },
    { name: "jrv", inherit: true },
  ],
};

export const root_menu = {
  role: ROLE_ACESS.ROOT,
  menu: [
    ...admin_menu.menu.filter((i) => i.inherit),
    { name: "user", inherit: true },
  ],
};

export const menu = [
  viewer_menu,
  digitizer_menu,
  supervisor_menu,
  admin_menu,
  root_menu,
];
