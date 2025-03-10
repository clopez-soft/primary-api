export const TotalMarkCongress = (
  municipality_id: any = "vc.municipality_id"
) => `select sum(rd.votes) as totalMark 
from record_detail rd 
     inner join record r 
        on r.id = rd.record_id 
       and r.active  = true
     inner join jrv j 
        on j.id = r.jrv_id 
       and j.active = true 
     inner join voting_center vc 
        on vc.id = j.voting_center_id 
       and vc.active = true  
where rd.active = true 
 and r."level" = 'congress'
 and vc.municipality_id  = ${municipality_id}`;

export const CountRecordCongress = (
  municipality_id: any = "vc.municipality_id"
) => `select count(1) as count_record 
from record r 
inner join jrv j 
        on j.id = r.jrv_id 
       and j.active = true 
     inner join voting_center vc 
        on vc.id = j.voting_center_id 
       and vc.active = true  
where r.active = true 
 and r."level" = 'congress'
 and vc.municipality_id  = ${municipality_id}
`;

export const TotalMarkCongressByParty = (
  municipality_id: any = "vc.municipality_id"
) => `select rd.movimiento_interno_id ,
sum(rd.votes) as totalMarkByParty
from record_detail rd 
inner join record r 
   on r.id = rd.record_id 
  and r.active  = true 
  inner join jrv j 
  on j.id = r.jrv_id 
 and j.active = true 
inner join voting_center vc 
  on vc.id = j.voting_center_id 
 and vc.active = true  
where rd.active = true 
and r."level" = 'congress'
and vc.municipality_id  = ${municipality_id}
group by rd.movimiento_interno_id 
order by 2 desc`;

export const TotalMarkCongressByCandidate = (
  municipality_id: any = "vc.municipality_id"
) => `select 
rd.movimiento_interno_id
,rd.political_alliance_id
,coalesce(pp.code, pa.code) code
,coalesce(pp.image_url, pa.image_url) movimiento_interno_image
,rd.candidate_id
,rd.number_box 
,c.box_number 
,c."name" 
,c.image_url 
,sum(rd.votes) as totalMarkByCandidate
from record_detail rd 
  inner join record r 
     on r.id = rd.record_id 
    and r.active  = true
  inner join candidate c 
     on c.id  = rd.candidate_id 
    and c.active = true
   left join movimiento_interno pp 
     on pp.id  = rd.movimiento_interno_id 
    and pp.active = true
   left join political_alliance pa 
     on pa.id = rd.political_alliance_id
    and pa.active = true
    inner join jrv j 
    on j.id = r.jrv_id 
   and j.active = true 
 inner join voting_center vc 
    on vc.id = j.voting_center_id 
   and vc.active = true  
where rd.active = true 
and r."level" = 'congress'
and vc.municipality_id  = ${municipality_id}
group by rd.movimiento_interno_id 
,rd.political_alliance_id
,pp.code 
,pa.code
,pp.image_url
,pa.image_url
,rd.candidate_id
,rd.number_box 
,c.box_number 
,c."name" 
,c.image_url 
order by 10 desc
`;

export const TotalMarkMayor = (
  municipality_id: string
) => `select sum(rd.votes) as totalMark 
from record_detail rd 
     inner join record r 
        on r.id = rd.record_id 
       and r.active  = true 
     inner join jrv j 
        on j.id  = r.jrv_id 
       and j.active = true
     inner join voting_center vc 
        on vc.id = j.voting_center_id 
       and vc.active = true
where rd.active = true 
 and r."level" = 'mayor'
 and vc.municipality_id = '${municipality_id}'`;

export const TotalMarkMayorByParty = (
  municipality_id: string
) => `select rd.movimiento_interno_id 
,pp.code 
,pp.image_url 
,sum(rd.votes) as totalmark 
from record_detail rd 
inner join record r 
   on r.id = rd.record_id 
  and r.active  = true 
inner join movimiento_interno pp 
   on pp.id  = rd.movimiento_interno_id 
  and pp.active = true
inner join jrv j 
   on j.id  = r.jrv_id 
  and j.active = true
inner join voting_center vc 
   on vc.id = j.voting_center_id 
  and vc.active = true

  inner join ballot_detail bd 
       on (bd.movimiento_interno_id  = rd.movimiento_interno_id 
           or bd.political_alliance_id  = rd.political_alliance_id
          )
      and bd.active = true 
     inner join ballot b 
        on b.id = bd.ballot_id 
       and b.municipality_id = vc.municipality_id 
       and b.active = true

where rd.active = true 
and r."level" = 'mayor'
and vc.municipality_id = '${municipality_id}'
group by rd.movimiento_interno_id 
,pp.code 
,pp.image_url 
order by 4 desc`;

export const CountRecordMayor = (
  municipality_id: string
) => `select count(1) as count_record 
from record r 
     inner join jrv j 
        on j.id  = r.jrv_id 
       and j.active = true
     inner join voting_center vc 
        on vc.id = j.voting_center_id 
       and vc.active = true
where r.active = true 
 and r."level" = 'mayor'
 and vc.municipality_id = '${municipality_id}'`;

export const PresidentCountRecord = `
 select count(1) as count_record 
  from record r 
 where r.active = true 
   and r."level" = 'president'
 `;

export const PresidentTotalVotes = `
select sum(rd.votes) as total_votes 
  from record_detail rd 
       inner join record r 
          on r.id  = rd.record_id 
         and r.active = true 
 where rd.active = true 
   and r."level" = 'president'
 `;

export const PresidentVotes = `
select rd.candidate_id 
       ,c."name" as candidate_name
       ,c.box_number 
       ,c.image_url as candidate_image
       ,c.flag_url as  candidate_flag
       ,rd.movimiento_interno_id 
       ,pp.code as movimiento_interno_code
       ,pp.image_url as movimiento_interno_image
       ,rd.political_alliance_id 
       ,pa.code as political_alliance_code
       ,pa.image_url as political_alliance_image
	   ,sum(rd.votes) as totalvotes
  from record_detail rd 
       inner join record r 
          on r.id = rd.record_id 
         and r.active  = true 
       inner join candidate c 
          on c.id = rd.candidate_id 
         and c.active = true
        left join movimiento_interno pp 
          on pp.id  = rd.movimiento_interno_id 
         and pp.active = true
        left join political_alliance pa 
          on pa.id = rd.political_alliance_id 
         and pa.active = true
 where rd.active = true 
   and r."level" = 'president'
 group by rd.candidate_id 
       ,c."name"
       ,c.box_number 
       ,c.image_url
       ,c.flag_url
       ,rd.movimiento_interno_id 
       ,pp.code 
       ,pp.image_url
       ,rd.political_alliance_id 
       ,pa.code 
       ,pa.image_url
 order by 11 desc
`;
