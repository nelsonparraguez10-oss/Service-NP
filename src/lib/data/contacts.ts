export interface ContactRecord {
  id: number;
  type: "client" | "supplier";
  name: string;
  rut: string;
  contact: string;
  email: string;
  phone: string;
  paymentMethod: string;
  district: string;
}

export const clients: ContactRecord[] = [
  { id: 1, type: "client", name: "Constructora ABC Ltda.",    rut: "76.543.210-K", contact: "Juan Pérez",    email: "jperez@abc.cl",          phone: "+56 9 1234 5678", paymentMethod: "Transferencia",  district: "Santiago"  },
  { id: 2, type: "client", name: "Inmobiliaria Sur SpA",      rut: "77.123.456-3", contact: "María González", email: "mgonzalez@sur.cl",        phone: "+56 9 8765 4321", paymentMethod: "Crédito 30 días",district: "Rancagua"  },
  { id: 3, type: "client", name: "Minera Norte SA",           rut: "90.876.543-2", contact: "Carlos Ríos",   email: "crios@nortemina.cl",       phone: "+56 9 5555 6666", paymentMethod: "Transferencia",  district: "Copiapó"   },
  { id: 4, type: "client", name: "Municipalidad de Rancagua", rut: "69.190.200-0", contact: "Secretaría",    email: "secretaria@muni.cl",       phone: "+56 72 222 3333", paymentMethod: "Cheque",         district: "Rancagua"  },
];

export const suppliers: ContactRecord[] = [
  { id: 5, type: "supplier", name: "Proveedor Químicos Sur",      rut: "78.456.789-1", contact: "Luis Morales", email: "lmorales@quimicossur.cl",  phone: "+56 9 9999 0000", paymentMethod: "Contado",       district: "Santiago" },
  { id: 6, type: "supplier", name: "Transportes Flores",          rut: "76.111.222-3", contact: "Ana Flores",   email: "aflores@transflores.cl",   phone: "+56 9 7777 8888", paymentMethod: "Transferencia", district: "Maipú"    },
  { id: 7, type: "supplier", name: "Ferretería Industrial S.A.",  rut: "79.234.567-8", contact: "Roberto Soto", email: "rsoto@ferreteriaindustrial.cl", phone: "+56 9 3333 4444", paymentMethod: "Contado",  district: "Santiago" },
  { id: 8, type: "supplier", name: "Suministros Mineros Ltda.",   rut: "77.987.654-2", contact: "Claudia Vera", email: "cvera@sumineros.cl",       phone: "+56 9 6666 7777", paymentMethod: "Transferencia", district: "Copiapó"  },
];
