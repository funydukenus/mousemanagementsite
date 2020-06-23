export interface pfaRecord {
   liver: number,
   liverTumor: number,
   smallIntestine: number,
   smallIntestineTumor: number,
   skin: number,
   skinHair: number,
   others: string
}

export interface freezeRecord {
   liver: number,
   liverTumor: number,
   others: string
}

export interface HarvestMouse{
   id: number,
   handler: string,
   physicalId: string,
   gender: string,
   mouseLine: string,
   genoType: string,
   birthDate: string,
   endDate: string,
   confirmationOfGenoType: string,
   phenoType: string,
   projectTitle: string,
   experiment: string,
   comment: string,
   pfaRecord: pfaRecord,
   freezeRecord: freezeRecord
}