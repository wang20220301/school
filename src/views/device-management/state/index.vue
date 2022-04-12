<template>
  <div class="content">
    <div class="block"></div>
    <div class="menu">
      <div class="box" @click="click1()">设备信息</div>
      <div class="box1" @click="click()">柜机状态</div>
    </div>
    <div class="form">
      <div class="list">
        <p class="listp" v-for="(item, index) in list" :key="index">
          {{ item }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      list: [
      
        "1",
        "2",
        "1",
        "2",
        "1",
        "2",
        "2",
        "1",
        "2",
        "2",
        "1",
        "2",
        "2",
        "1",
        "2",
      ],
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
      },
      temp: {
        name: "",
        monitor_no: "",
        kind: "",
        type: 4,
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    click() {
      this.$router.push("/device-management/state");
    },
    click1() {
      this.$router.push("/device-management/details");
    },
  },
};
</script>

<style scoped>
.content {
  height: calc(100vh - 5.9vh);
  background: hsla(216, 17%, 94%, 1);
}
.block {
  padding-top: 20px;
}
.menu {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 68px;
  background: #fff;
  display: flex;
}
.box1 {
  border-bottom: 3px hsla(210, 100%, 63%, 1) solid;
}
.box,
.box1 {
  width: 130px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  margin-left: 20px;
  margin-right: 20px;
  height: 73vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.list {
  /* height: 500px;
  width: 800px;
  display: flex;
  flex-wrap: wrap; */
  width: 800px;
  height: 500px;
  display: flex;
  /* flex-direction: row; */
  flex-wrap: wrap;
  align-content: flex-end;
  /* align-content: space-between; */
  
  
}
.listp {
  width: 100px;
  height: 32px;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  margin-right: 20px;
  border: 1px dashed red;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.12);
  /* align-content: flex-end; */
}
</style>