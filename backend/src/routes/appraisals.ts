import express, { Request, Response } from 'express';
import { createAppraisal, getAppraisal,
        updateAppraisal, getRecentAppraisals,
        getUserGoals} from '../controllers/authController';

const router = express.Router();

router.get('/', getAppraisal);           
router.put('/:id', updateAppraisal);   
router.post('/appraisal', createAppraisal);  
router.get("/recent-appraisals", getRecentAppraisals);  
router.get("/goals", getUserGoals);  

export default router;
