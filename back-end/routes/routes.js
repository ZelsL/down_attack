import express from "express";
//import CalculaStackSoberana from '../CalculaStackSoberana.js';
//import EnhancementCalculator from '../EnhancementCalculator.js';
//import { getEnhanceableItems, getEnhanceableItemById } from '../services/enhanceableItemService.js';
//import { saveSimulatorState, accessSimulatorState } from '../services/saveSimulatorStateService.js';

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.json({ message: "API funcionando!", views: req.session.views });
  } else {
    req.session.views = 1;
    res.json({
      message: "API funcionando!",
      BemVindo: "Essa é sua primeira visita!",
    });
  }
});

/*router.get('/fs-optimizer', async (req, res)=>{
    try {
        const {tier, baseChance, valks, stacks, item, region} = req.query;
        const calculators = await CalculaStackSoberana.create(region, item);
        const result = calculators.findOptimalStack(
            parseInt(tier),
            parseInt(baseChance),
            parseInt(valks),
            parseInt(stacks)
        );
        res.json({ success:true, result})
    } catch (error){
        res.status(500).json({success: false, error: error, stack: error.stack, tier: error.tier, baseChance: error.baseChance, valks: error.valks, stacks: error.stacks, item: error.item, region: error.region });
    }
})

router.get('/get-success-rate-and-data', async (req, res)=>{
    try {
        const {tier, stack, itemId} = req.query;
        
        const calculators = new EnhancementCalculator(parseInt(itemId));
        const result = calculators.getSuccessRateAndData(
            tier,
            parseInt(stack),
        );
        res.json({ success:true, result})
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})

router.get('/enhanceable-items', async (req, res)=>{
    try {
        const items = await getEnhanceableItems();
        res.json({ success: true, items });
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})
router.get('/enhanceable-items/:id', async (req, res)=>{
    try {
        const item = await getEnhanceableItemById(req.params.id);
        res.json({ success: true, item });
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})

router.post('/simulator-state', async (req, res) => {  
    try {  
        if(req.body === undefined) {
            return res.status(400).json({ success: false, error: 'Corpo da requisição não enviado.' });
        }
        const {  
            enhanceable_item_id,  
            tier,  
            base_failstack,  
            valks_cry,  
            perm_enh_chance  
        } = req.body;  
  
        if (!enhanceable_item_id || !tier) {  
            return res.status(400).json({   
                success: false,   
                error: 'Dados inválidos. O item e o tier são obrigatórios.'   
            });  
        }  
  
        const presetDetails = {  
            user_id: req.user ? req.user.id : null,
            session_id: req.session ? req.session.id : null,
            enhanceable_item_id,  
            tier,  
            base_failstack,  
            valks_cry,  
            perm_enh_chance  
        };  
  
        const presetId = await saveSimulatorState(presetDetails);  
          
        res.status(201).json({ success: true, presetId });

    } catch (error) {   
        console.error("Erro ao salvar o preset:", error);  
        res.status(500).json({ success: false, error: 'Ocorreu um erro interno ao salvar o preset.' });  
    }  
});

router.get('/simulator-state', async (req, res) => {
    try {
        const session_id = req.session.id;
        const user_id = req.user ? req.user.id : null;
        const state = await accessSimulatorState(user_id, session_id);
        res.status(200).json({ success: true, state, session_id });
    } catch (error) {
        console.error("Erro ao acessar o estado do simulador:", error);
        res.status(500).json({ success: false, error: 'Ocorreu um erro interno ao acessar o estado do simulador.' });
    }
});*/

export default router;
