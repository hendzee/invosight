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

Route.group(() => {
    Route.get('invosight-user', 'InvosightUserController.index')
    Route.get('invosight-user/:id', 'InvosightUserController.show')
    Route.post('invosight-user', 'InvosightUserController.store').validator('StoreUser')
    Route.put('invosight-user/:id', 'InvosightUserController.update').validator('UpdateUser')
    Route.delete('invosight-user/:id', 'InvosightUserController.delete')
}).prefix('api')
