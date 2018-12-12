import Koa from 'koa'
import Router from 'koa-router'
import kcors from 'kcors'
import bodyParser from 'koa-bodyparser'
// DI Container
import containerScope from '../lib/middleware/containerScope'
import serviceContainer from '../lib/serviceContainer'
import apiContainer from '../lib/apiContainer'
import responseCalls from '../lib/middleware/responseCalls'
// elklog
// import elkLog from '../lib/middleware/elkLog';
// 404
import notFoundHandler from '../lib/middleware/notFound'
import userlogin from '../app/apis/v1/userApi'
/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Koa} The configured app.
 */
export default async function createServer () {
  const app = new Koa()
  const router = new Router()

  // app.use(elkLog);
  // app.use(logger());
  app.use(responseCalls)
  app.use(kcors())
  app.use(bodyParser())

  // DI Container
  // Container is configured with our services and whatnot.
  const container = serviceContainer()
  apiContainer(router, container)

  // Adds middleware that creates a new Container Scope for each request.
  app.use(containerScope(container))

  // Install routes
  app.use(router.allowedMethods())
  app.use(router.routes())

  // Default handler when nothing stopped the chain.
  app.use(notFoundHandler)
  app.use(userlogin)
  return app
}
