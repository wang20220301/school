<template>
  <div class="content">
    <div class="block"></div>
    <div class="menu">
      <div class="box" @click="click1()">设备信息</div>
      <div class="box1" @click="click()">柜机状态</div>
    </div>
    <div class="details">
      <div class="list">
        <div class="tab">
          <p
            class="Chest"
            v-for="(item, index) in list"
            :key="index"
            @click="clickOpen(item)"
            title="开门或清货"
          >
            {{ item }}
          </p>
        </div>
        <div class="explain">
          <div class="text">
            <div class="text-box1">
              <div></div>
              <p>空闲</p>
            </div>
            <div class="text-box2">
              <div></div>
              <p>有货</p>
            </div>
            <div class="text-box3">
              <div></div>
              <p>未关门</p>
            </div>
          </div>
        </div>
        <div class="control">
          <p>柜子控制:</p>
          <div>
            <el-button type="primary" size="mini">开门</el-button>
            <el-button type="primary" size="mini">清货</el-button>
            <el-button type="primary" size="mini">一键清货</el-button>
          </div>
        </div>
      </div>
      <footer class="introduce">
        <div class="introduce-title">
          <p>说明：</p>
          <div class="introdice-text">
            <p>开门：选择需要开门的柜子（可多选</p>
            <p>一键清货：将全部柜子状态，从“有货”转变成“空闲”</p>
            <p>一键清货：将全部柜子状态，从“有货”转变成“空闲”</p>
          </div>
        </div>
      </footer>
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
    clickOpen(valid) {
      console.log("打印选中的值", valid);
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
.details {
  margin-left: 20px;
  margin-right: 20px;
  height: 73vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  align-content: flex-start;
}
.list {
  width: 800px;
  display: flex;
  flex-direction: column;
}
.tab {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  cursor: pointer;
}
.explain {
  width: 100%;
  margin-top: 20px;
  height: 28px;
  display: flex;
  justify-content: center;
}
.text {
  width: 400px;
  height: 28px;
  display: flex;
  justify-content: center;
}
.text-box1,
.text-box2,
.text-box3 {
  display: flex;
  width: 150px;
  height: 28px;
  align-items: center;
}
.text-box1 div {
  width: 27px;
  height: 12px;
  margin-right: 10px;
  background: rgba(0, 0, 0, 0.12);
}
.text-box2 div {
  width: 27px;
  height: 12px;
  margin-right: 10px;
  background: #00bc55;
}
.text-box3 div {
  width: 27px;
  height: 12px;
  margin-right: 10px;
  background: #fba500;
  /* background: #00bc55; */
}
.control {
  width: 100%;
  margin-top: 20px;
  height: 28px;
  display: flex;
  align-items: center;
}
.control p {
  width: 70px;
  height: 21px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
}
.control div {
  display: flex;
  align-items: center;
}
.control div p {
  width: 84px;
  height: 28px;
  /* background: #5196ff; */
  border-radius: 4px;
  margin-right: 20px;
}
.Chest {
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 99px;
  height: 33px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.introduce {
  margin: 0;
  width: calc(100% - 88 * 2px);
  height: 100px;
  background: #f8f9fb;
}
.introduce-title p {
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: JUSTIFIED;
  color: #282d30;
  line-height: 20px;
}
.introdice-text p {
  font-size: 10px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: LEFT;
  color: #909399;
  line-height: 10px;
}
</style>