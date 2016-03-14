var middleware = require('../middleware');
var controller = require('../controller');
var router = require('koa-router')();

router.get('/', controller.index.index);

// 认证模块
// 登录
router.get('/auth/mobile/:mobile/password/:password', controller.auth.verify);
// 注册
router.post('/auth', controller.auth.register);

// 用户模块
// 修改用户信息
router.put('/user', middleware.authenticate, controller.user.setting);
// 关注另一个用户
router.post('/user/attention_to/user', middleware.authenticate, controller.user.attentionToUser);
// 取消关注另一个用户
router.delete('/user/attention_to/user/user_id/:user_id', middleware.authenticate, controller.user.cancelAttentionToUser);
// 收藏某一个书单
router.post('/user/collect/book_list', middleware.authenticate, controller.user.collectBookList);
// 取消关注某一个书单
router.delete('/user/collect/book_list/book_list_id/:book_list_id', middleware.authenticate, controller.user.cancelCollectBookList);

// 书籍模块
// 创建书籍
router.post('/book', middleware.authenticate, controller.book.create);
// 更新书籍
router.put('/book', middleware.authenticate, controller.book.update);
// 查询书籍
router.get('/book/book_id/:book_id', middleware.authenticate, controller.book.read);
// 删除书籍
router.delete('/book/book_id/:book_id', middleware.authenticate, controller.book.delete);

// 书单模块
// 创建书单
router.post('/book_list', middleware.authenticate, controller.book_list.create);
// 更新书单
router.put('/book_list', middleware.authenticate, controller.book_list.update);
// 查询书单
router.get('/book_list/book_list_id/:book_list_id', middleware.authenticate, controller.book_list.read);
// 删除书单
router.delete('/book_list/book_list_id/:book_list_id', middleware.authenticate, controller.book_list.delete);
// router.get('/admin', middleware.authenticate, controller.admin.index);

router.all('*', function*() {
	this.status = 404;
});

module.exports = router;