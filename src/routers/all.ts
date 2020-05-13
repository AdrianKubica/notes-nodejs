import express from 'express'

const router = express.Router()

router.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => res.sendStatus(405))

export default router
