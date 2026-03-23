const express = require('express');
const router = express.Router();
const { 
  getPets, getPet, createPet, updatePet, deletePet,
  addVaccineRecord, getVaccineRecords,
  addDewormRecord, getDewormRecords,
  addExamRecord, getExamRecords,
  addMedicalRecord, getMedicalRecords
} = require('../controllers/pet');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// 宠物CRUD
router.get('/', getPets);
router.get('/:id', getPet);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

// 疫苗记录
router.get('/:id/vaccines', getVaccineRecords);
router.post('/:id/vaccines', addVaccineRecord);

// 驱虫记录
router.get('/:id/deworm', getDewormRecords);
router.post('/:id/deworm', addDewormRecord);

// 体检记录
router.get('/:id/exam', getExamRecords);
router.post('/:id/exam', addExamRecord);

// 就医记录
router.get('/:id/medical', getMedicalRecords);
router.post('/:id/medical', addMedicalRecord);

module.exports = router;