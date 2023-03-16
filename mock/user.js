
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  {
    url: '/getList',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          {
              "id": "150793960494354432",
              "username": "abc",
              "email": "123@123.com",
              "head": "http://124.222.196.87:9000/movie/user_image/default.jpg",
              "birthday": "1999-12-31",
              "info": "123abc",
              "gender": 1,
              "createTime": "2023-02-20",
              "types": [
                  "Film-Noir",
                  "Action",
                  "Adventure",
                  "Horror"
              ]
          },
          {
              "id": "151474213189472256",
              "username": "czc",
              "email": "123@456.com",
              "head": "http://124.222.196.87:9000/movie/user_image/default.jpg",
              "birthday": "1998-12-31",
              "info": "456789",
              "gender": 1,
              "createTime": "2023-02-22",
              "types": [
                  "Drama",
                  "Crime",
                  "Adventure",
                  "Romance",
                  "War"
              ]
          }
      ]
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
