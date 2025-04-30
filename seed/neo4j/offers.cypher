// Création des noeuds villes NYC et LHR si pas déjà faits
MERGE (nyc:City {code: "NYC"})
MERGE (lhr:City {code: "LHR"})

// Création des offres et relations villes
MERGE (offer1:Offer {_id: "2e58e0ea1c8667782cb10801"})
MERGE (offer1)-[:FROM]->(:City {code: "NYC"})
MERGE (offer1)-[:TO]->(lhr)

MERGE (offer2:Offer {_id: "4b9e80c3299b2d17c299e925"})
MERGE (offer2)-[:FROM]->(:City {code: "IST"})
MERGE (offer2)-[:TO]->(lhr)

MERGE (offer3:Offer {_id: "2d6c112478db7909652eb78a"})
MERGE (offer3)-[:FROM]->(lhr)
MERGE (offer3)-[:TO]->(:City {code: "DXB"})

// Création du noeud Offer et relations FROM/TO
MERGE (offer4:Offer {_id: "62f576c9c2c28f895a4013a4"})
MERGE (offer4)-[:FROM]->(nyc)
MERGE (offer4)-[:TO]->(lhr)