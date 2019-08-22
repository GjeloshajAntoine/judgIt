const userModelInit = require('./model')
const uuidv4 = require('uuid/v4');
const assert = require('assert');

module.exports = function (db) {
    const userModel = userModelInit(db)

    describe('user :',function () {

        let createdUser = {
            id :0,
            token: ''
        }
        
        it('should return bigger than 0', async function () {
            let token = uuidv4()
            token.should.be.a('string')
            let userId = await userModel.createUserWithExtensionToken(token)
            userId.should.be.above(0)

            createdUser.id = userId
            createdUser.token = token
        })

        it('Token sould retreive the same id',async function () {
            let userId = await userModel.getUserIdByExtensionToken(createdUser.token)
            userId.should.be.equal(createdUser.id)
        })

    })
}