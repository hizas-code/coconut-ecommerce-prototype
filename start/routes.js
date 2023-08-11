'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.post('v1/login', 'AuthController.login')
Route.post('v1/register', 'AuthController.register')

Route.group(() => {
  Route.get('/', 'ProductController.list')
  Route.get('/:id', 'ProductController.show')
  Route.post('/', 'ProductController.store')
  Route.put('/:id', 'ProductController.update')
  Route.delete('/:id', 'ProductController.delete')
}).prefix('v1/products').middleware(['auth'])

Route.group(() => {
  Route.get('/', 'ProductCategoryController.list')
  Route.post('/', 'ProductCategoryController.store')
  Route.patch('/:id', 'ProductCategoryController.update')
  Route.delete('/:id', 'ProductCategoryController.delete')
}).prefix('v1/product-categories').middleware(['auth'])

Route.group(() => {
  Route.get('/', 'WarehouseController.list')
  Route.get('/:id', 'WarehouseController.show')
  Route.post('/', 'WarehouseController.store')
  Route.patch('/:id', 'WarehouseController.update')
  Route.delete('/:id', 'WarehouseController.delete')
}).prefix('v1/warehouses').middleware(['auth'])

Route.group(() => {
  Route.post('/add', 'StockController.add')
  Route.get('/report', 'StockController.report')
  Route.get('/report/:id', 'StockController.reportDetail')
}).prefix('v1/stocks').middleware(['auth'])

Route.group(() => {
  Route.post('/create', 'OrderController.create')
  Route.post('/confirm', 'OrderController.confirm')
  Route.post('/finish', 'OrderController.finish')
}).prefix('v1/orders').middleware(['auth'])


