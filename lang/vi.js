export default {
  rules: {
    password: {
      required: 'Mật khẩu là bắt buộc',
      length: 'Mật khẩu dài từ {min} đến {max}',
      notMatch: 'Mật khẩu không trùng nhau',
      wrong: 'Sai mật khẩu'
    },
    firstName: {
      required: 'Họ là bắt buộc'
    },
    lastName: {
      required: 'Tên là bắt buộc'
    },
    email: {
      required: 'Địa chỉ email là băt buộc',
      notValid: 'Địa chỉ email không hợp lệ',
      duplicate: 'Địa chỉ email đã được đăng ký'
    },
    file: {
      noImage: 'Chưa chọn hình ảnh',
      max: 'Kích thước file nhỏ hơn {max} MB'
    },
    title: {
      required: 'Tên trang là bắt buộc'
    },
    role: {
      required: 'Quyền là bắt buộc'
    },
    tagName: {
      required: 'Tên thẻ là bắt buộc',
      duplicate: 'Tên thẻ đã bị trùng'
    },
    post: {
      title: 'Tên bài viết là bắt buộc',
      status: 'Tình trạng là bắt buộc',
      open: 'Ngày bắt đầu là bắt buộc',
      close: 'Ngày đóng là bắt buộc'
    },
    content: {
      required: 'Nội dung là bắt buộc'
    }
  },
  logIn: {
    fail: 'Sai địa chỉ email, password'
  },
  text: {
    btn: {
      dashboard: 'Dashboard',
      accountInfo: 'Thông tin tài khoản',
      logOut: 'Đăng xuất',
      logIn: 'Đăng nhập',
      register: 'Đăng ký',
      read: 'Đọc',
      readMore: 'Đọc thêm',
      open: 'Mở',
      update: 'Cập nhật',
      delete: 'Xoá',
      logInProvider: 'Đăng nhập với',
      resetPassword: 'Đặt mật khẩu mới',
      restorePassword: 'Khôi phục mật khẩu',
      send: 'Gửi',
      forgotPassword: 'Quên mật khẩu',
      home: 'Trang chủ',
      comment: 'Bình luận',
      file: 'Tập tin',
      setting: 'Cài đặt',
      create: 'Tạo',
      list: 'Danh sách',
      bgHeader: 'Chọn hình bìa',
      icon: 'Chọn icon',
      save: 'Lưu',
      selectRemove: 'Xoá mục đã chọn',
      choosePhoto: 'Chọn hình ảnh',
      close: 'Đóng',
      ok: 'OK'
    },
    textField: {
      search: 'Tìm kiếm ...',
      password: 'Mật khẩu',
      rePassword: 'Nhập lại mật khẩu',
      email: 'E-mail',
      firstName: 'Họ',
      lastName: 'Tên',
      changePassword: 'Đổi mật khẩu',
      oldPassword: 'Mật khẩu cũ',
      remember: 'Ghi nhớ đăng nhập',
      post: 'Bài viết',
      tag: 'Thẻ',
      account: 'Tài khoản',
      title: 'Tên trang',
      description: 'Mô tả trang',
      menuName: 'Tên menu',
      link: 'Liên kết',
      editMenu: 'Chỉnh sửa Menu',
      itemMenu: 'Tên menu',
      deleteItem: 'Bạn có muốn xoá mục này?',
      content: 'Nội dung',
      searchNotFound: 'Không tìm thấy bài phù hợp',
      hostname: 'Hostname',
      keywords: 'Từ khoá'
    },
    linkAccount: 'Đã liên kết tài khoản',
    timeUpdate: 'Cập nhật lúc',
    searchKeyword: 'Tìm kiếm cho "{keyword}"',
    post: {
      newest: 'Bài viết mới nhất',
      all: 'Tất cả bài viết',
      title: 'Tiêu đề',
      status: 'Tình trạng',
      user: 'Người viết bài',
      createdAt: 'Ngày viết bài',
      action: 'Hành động',
      list: 'DANH SÁCH BÀI VIẾT',
      excerpt: 'Trích đoạn',
      openDate: 'Ngày bắt đầu',
      closeDate: 'Ngày kết thúc',
      keyword: 'Từ khoá'
    },
    setting: {
      title: 'CÀI ĐẶT TRANG',
      menu1: 'Cài đặt chung',
      menu2: 'Cài đặt Menu'
    },
    account: {
      newest: 'Tài khoản mới nhất',
      fullName: 'Họ và tên',
      email: 'Email',
      role: 'Quyền',
      createdAt: 'Ngày đăng ký',
      action: 'Hành động',
      photo: 'Ảnh',
      deleted: 'Tài khoản đã bị xoá',
      list: 'DANH SÁCH TÀI KHOẢN',
      firstName: 'Họ',
      lastName: 'Tên'
    },
    file: {
      list: 'DANH SÁCH TẬP TIN',
      filename: 'Tên tập tin',
      length: 'Kích thước',
      uploadDate: 'Ngày tải lên',
      action: 'Hành động',
      upload: 'Tải tập tin lên'
    },
    comment: {
      list: 'DANH SÁCH BÌNH LUẬN',
      content: 'Nội dung bình luận',
      user: 'Người bình luận',
      post: 'Bài viết',
      createdAt: 'Ngày bình luận',
      action: 'Hành động',
      logIn: 'Đăng nhập để bình luận'
    },
    tag: {
      list: 'DANH SÁCH THẺ',
      name: 'Tên thẻ',
      slug: 'Slug',
      postCount: 'Tổng số bài viết',
      action: 'Hành động'
    }
  },
  message: {
    success: {
      update: 'Đã cập nhật thành công',
      register: 'Đã đăng ký thành công',
      logIn: 'Đăng nhập thành công',
      sendMailRestore: 'Đã gửi yêu cầu khôi phục mật khẩu vào mail của bạn',
      delete: 'Đã xoá thành công',
      create: 'Đã tạo thành công'
    },
    fail: 'Chưa nhập đủ thông tin',
    error: 'Đã xảy ra lỗi'
  },
  head: {
    home: 'Trang chủ',
    search: 'Tìm kiếm',
    tag: 'Thẻ',
    blog: 'Trang Blog',
    post: 'Bài viết',
    author: 'Tác giả',
    user: 'Thông tin tài khoản',
    register: 'Đăng ký tài khoản',
    login: 'Đăng nhập',
    reset: 'Quên mật khẩu',
    resetKey: 'Đặt mật khẩu mới',
    setting: 'Cài đặt trang',
    dashboard: 'Dashboard',
    file: 'Quản lí tập tin',
    comment: 'Quản lí comment',
    duser: {
      index: 'Quản lí tài khoản',
      edit: 'Điền thông tin'
    },
    dtag: {
      index: 'Quản lí thẻ',
      edit: 'Điền thông tin'
    },
    dpost: {
      index: 'Quản lí bài viết',
      edit: 'Điền thông tin'
    }
  }
}
