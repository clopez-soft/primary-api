export const Get_JRV_Info = (jrvNumber: number = 0): string => `
    select c.id as CountryId
         ,c.code as CountryCode
         ,c."name" as CountryName
         ,d.id as DeparmentId
         ,d.code as DeparmentCode
         ,d."name" as DeparmentName
         ,m.id as MunicipalityId
         ,m.code as MunicipalityCode
         ,m."name" as MunicipalityName
         ,vc.id as VotingCenterId
         ,vc.code as VotingCenterCode
         ,vc.electoral_sector 
         ,vc.area 
         ,vc."name" as VotingCenterName
         ,j.id
         ,j."name" 
         ,j."number" 
         ,j.electoral_weight 
      from jrv j 
           inner join voting_center vc 
              on vc.id = j.voting_center_id 
             and vc.active = true 
           inner join municipality m 
              on m.id = vc.municipality_id 
             and m.active = true 
           inner join department d 
              on d.id = m.department_id 
             and d.active = true 
           inner join country c 
              on c.id = d.country_id 
             and c.active = true 
     where j.active = true 
       and j."number" = ${jrvNumber}
              `;