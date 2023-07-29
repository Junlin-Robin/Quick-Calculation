<template>
  <div class="container">
    <div class="title">
      <h3>请上传您所需要计算的文件<span @click="addCaculationTask">+</span></h3>
    </div>
    <ul class="fileList">
      <div
        class="uploadContainer"
        v-for="item in inputCollector"
        :key="item.id"
      >
        <li class="fileItem">
          <div class="nameContainer">
            <input
              type="text"
              v-model="item.name"
              @keyup.enter="close_change_Task_Name($event, item)"
              @focusout="close_change_Task_Name($event, item)"
              v-if="!item.isshowchangename"
              ref="input_name"
            />
            <h3
              @dblclick="show_change_Task_Name(item)"
              v-if="item.isshowchangename"
              :calculateSuccess="item.isSuccess"
            >
              {{ item.name }} <span v-if="item.isSuccess">✔</span>
            </h3>
          </div>

          <hr />
          <input
            type="radio"
            :name="item.id"
            id="CASTEP"
            :checked="item.showCASTEP"
            @click="change_CASTEP(item)"
          />CASTEP<span v-if="item.showCASTEP"
            ><input
              type="checkbox"
              :name="item.id"
              v-model="item.fixAtoms"
            />isFixAtoms
          </span>
          <input
            type="radio"
            :name="item.id"
            id="GAUSSIAN"
            :checked="!item.showCASTEP"
            @click="change_GAUSSIAN(item)"
          />GAUSSIAN
          <br />
          <div class="fileContainer">
            <div v-if="item.showCASTEP">
              <div
                class="uploadFile"
                :success="Boolean(item.inputFileName.lighter)"
              >
                <p style="font-size: 15px; font-weight: 500">
                  低质量数<br /><span style="font-size: 8px; font-weight: 400"
                    >请上传*_Efield.castep文件</span
                  >
                </p>
                <div>
                  <p>
                    {{
                      item.inputFileName.lighter ||
                      "Drop files here to upload..."
                    }}
                  </p>
                  <label :for="item.id + 'lighter'">选择文件</label>
                </div>
              </div>
              <input
                type="file"
                name="lighter"
                :id="item.id + 'lighter'"
                @change="input_Data_lighter($event, item)"
                :inputFileName="item.inputFileName.lighter"
              />
              <!-- <br /> -->
              <div
                class="uploadFile"
                :success="Boolean(item.inputFileName.heavier)"
              >
                <p style="font-size: 15px; font-weight: 500">
                  高质量数<br /><span style="font-size: 8px; font-weight: 400"
                    >请上传*_Efield.castep文件</span
                  >
                </p>
                <div>
                  <p>
                    {{
                      item.inputFileName.heavier ||
                      "Drop files here to upload..."
                    }}
                  </p>
                  <label :for="item.id + 'heavier'">选择文件</label>
                </div>
              </div>
              <input
                type="file"
                name="heavier"
                :id="item.id + 'heavier'"
                @change="input_Data_heavier($event, item)"
              />
              <!-- <br/> -->

              <div
                v-if="item.fixAtoms"
                class="uploadFile"
                :success="Boolean(item.inputFileName.cell)"
              >
                <p style="font-size: 15px; font-weight: 500">
                  Cell文件<br /><span style="font-size: 8px; font-weight: 400"
                    >请上传*.cell</span
                  >
                </p>
                <div>
                  <p>
                    {{
                      item.inputFileName.cell || "Drop files here to upload..."
                    }}
                  </p>
                  <label :for="item.id + 'cell'">选择文件</label>
                </div>
              </div>
              <input
                type="file"
                name="cell"
                :id="item.id + 'cell'"
                @change="input_Data_cell($event, item)"
              />
            </div>
            <div v-if="!item.showCASTEP">
              <div
                class="uploadFile"
                :success="Boolean(item.inputFileName.GAUSSIAN)"
              >
                <p style="font-size: 15px; font-weight: 500">
                  GAUSSIAN文件<br /><span style="font-size: 8px; font-weight: 400"
                    >请上传*.fchk</span
                  >
                </p>
                <div>
                  <p>
                    {{
                      item.inputFileName.cell || "Drop files here to upload..."
                    }}
                  </p>
                  <label :for="item.id + 'GAUSSIAN'" style="cursor: not-allowed;">选择文件</label>
                </div>
              </div>
              <input
                type="file"
                name="GAUSSIAN"
                :id="item.id + 'GAUSSIAN'"
                disabled
              />
            </div>
          </div>

          <div>
            <button @click="Delete(item)">删 除</button>
            <button @click="Calculation_RPFR(item)">计 算</button>
          </div>
        </li>
      </div>
    </ul>
    <p>
      注意：目前只开发了CASTEP中IR频率计算RPFR和1000lnβ的计算服务，Phonon计算和GAUSSIAN计算待开发，请勿使用，谢谢！<br />
      <a href="mailto:347258143@qq.com">如果发现bug，请与作者联系！</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect, ref, nextTick, provide } from "vue";
import dealFile from "../hooks/Calcualtion_RPFR";
import { nanoid } from "nanoid";
import { useCalculateStore } from "../stores/calculate";
import { storeToRefs } from "pinia";



const store = useCalculateStore();
const { calculation_results } = storeToRefs(store);
const input_name = ref();

if (!localStorage.getItem("CASTEP_IR_Information")) {
  localStorage.setItem(
    "CASTEP_IR_Information",
    JSON.stringify([
      {
        id: nanoid(),
        name: "new Task",
        showCASTEP: true,
        isshowchangename: true,
        fixAtoms: false,
        inputValue_CASTEP_lighter: "",
        inputValue_CASTEP_heavier: "",
        inputValue_GAUSSIAN: "",
        inputCellFile: "",
        inputFileName: {
          lighter: "",
          heavier: "",
          cell: "",
          GAUSSIAN: "",
        },
        isSuccess:false,
      },
    ])
  );
}

const inputCollector: inputCollectorShape[] = reactive(
  JSON.parse(localStorage.getItem("CASTEP_IR_Information") as string)
);

interface fileEvent extends EventInit {
  target: {
    files: {
      [index: number]: {
        name: string;
        size: string;
      };
      length: number;
    };
  };
}
interface inputCollectorShape {
  id: string;
  name: string;
  showCASTEP: boolean;
  isshowchangename: boolean;
  fixAtoms: boolean;
  inputValue_CASTEP_lighter: string;
  inputValue_CASTEP_heavier: string;
  inputValue_GAUSSIAN: string;
  inputCellFile: string;
  inputFileName: {
    lighter: string;
    heavier: string;
    cell: string;
    GAUSSIAN: string;
  };
  isSuccess:boolean;
}
const change_CASTEP = (item: { showCASTEP: boolean }): void => {
  item.showCASTEP = true;
};
const change_GAUSSIAN = (item: { showCASTEP: boolean }): void => {
  item.showCASTEP = false;
};
const Calculation_RPFR = (item: inputCollectorShape) => {
  if (
    calculation_results.value.find(
      (innerItem: { id: string; name: string; value: any }) =>
        innerItem.id === item.id
    )
  ) {
    alert("该任务已经计算过了，如需重新计算请删除任务后重新添加！");
    return;
  }
  if(item.fixAtoms && item.inputCellFile === ''){
    alert("请上传cell文件！");
    return;
  }
  if(!item.fixAtoms){
    if(item.inputValue_CASTEP_heavier === '' || item.inputValue_CASTEP_lighter === ''){
      alert("请上传计算文件！");
    return;
    }
  }
  if (item.showCASTEP) {
    let tempdata,ISOinfo;
    try {
      ({results:tempdata,isotopeInformation:ISOinfo} = dealFile(
        item.inputValue_CASTEP_lighter,
        item.inputValue_CASTEP_heavier,
        item.inputCellFile
      ));
    } catch (error) {
      console.log(error);
      alert("计算出问题了，请检查输入数据格式");
      return;
    }
    item.isSuccess = true;
    (calculation_results.value as any[]).push({
      id: item.id,
      name: item.name,
      information:ISOinfo,
      value: tempdata,
    });

  }
};
const input_Data_lighter = (e: Event, dataItem: inputCollectorShape): void => {
  const file = (e as unknown as fileEvent).target.files[0];
  const name = (e as unknown as fileEvent).target.files[0].name.split(".")[0];
  dataItem.inputFileName.lighter = (
    e as unknown as fileEvent
  ).target.files[0].name;
  const reader = new FileReader();

  reader.readAsText(file as unknown as Blob, "utf-8");
  reader.onload = () => {
    if (dataItem.showCASTEP) {
      dataItem.inputValue_CASTEP_lighter = reader.result as string;
      console.log(reader.result);
    } else {
      dataItem.inputValue_GAUSSIAN = reader.result as string;
    }
    dataItem.name = name;
  };
};
const input_Data_heavier = (e: Event, dataItem: inputCollectorShape): void => {
  const file = (e as unknown as fileEvent).target.files[0];
  dataItem.inputFileName.heavier = (
    e as unknown as fileEvent
  ).target.files[0].name;
  const reader = new FileReader();
  reader.readAsText(file as unknown as Blob, "utf-8");
  reader.onload = () => {
    if (dataItem.showCASTEP) {
      dataItem.inputValue_CASTEP_heavier = reader.result as string;
    } else {
      dataItem.inputValue_GAUSSIAN = reader.result as string;
    }
  };
};
const addCaculationTask = (): void => {
  inputCollector.push({
    id: nanoid(),
    name: "new Task",
    showCASTEP: true,
    isshowchangename: true,
    fixAtoms: false,
    inputValue_CASTEP_lighter: "",
    inputValue_CASTEP_heavier: "",
    inputValue_GAUSSIAN: "",
    inputCellFile: "",
    inputFileName: {
      lighter: "",
      heavier: "",
      cell: "",
      GAUSSIAN: "",
    },
    isSuccess:false
  });
};

const Delete = (deleteItem: { id: string }) => {
  let index = inputCollector.findIndex((item) => {
    return item.id === deleteItem.id;
  });
  inputCollector.splice(index, 1);
  let index2 = calculation_results.value.findIndex((item: { id: string }) => {
    return item.id === deleteItem.id;
  });
  //判断是否找到了对应的数据
  if (index2 !== -1) {
    calculation_results.value.splice(index2, 1);
  }
};
const close_change_Task_Name = (e: Event, item: inputCollectorShape) => {
  item.isshowchangename = true;
  calculation_results.value[
    calculation_results.value.findIndex(
      (innerItem: { id: string; name: string; value: any }) =>
        innerItem.id === item.id
    )
  ].name = (e.target as HTMLInputElement).value;
};
const show_change_Task_Name = (item: inputCollectorShape) => {
  item.isshowchangename = false;
  nextTick(() => {
    console.log(input_name.value);
    input_name.value[0].focus();
  });
};

const input_Data_cell = (e: Event, dataItem: inputCollectorShape) => {
  const file = (e as unknown as fileEvent).target.files[0];
  dataItem.inputFileName.cell = (
    e as unknown as fileEvent
  ).target.files[0].name;
  const reader = new FileReader();

  reader.readAsText(file as unknown as Blob, "utf-8");
  reader.onload = () => {
    dataItem.inputCellFile = reader.result as string;
  };
};

watchEffect(() => {
  localStorage.setItem("CASTEP_IR_Information", JSON.stringify(inputCollector));
  localStorage.setItem(
    "calculation_results",
    JSON.stringify(calculation_results.value)
  );
});

provide("a", input_Data_lighter);
</script>

<style>
.container {
  padding: 0px 20px;
}
ul li {
  list-style: none;
  overflow: hidden;
  width: 100%;
}
.title {
  color: #3e3e3e;
  text-align: center;
  margin: 15px 0;
  line-height: 32px;
}
.title span {
  float: right;
  font-size: 25px;
  /* line-height: 32px; */
  cursor: pointer;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  transition: all .5s ease;
  /* display: inline-block; */
}
.title span:hover {
  background-color: #b4b4b4;
  color: #fff;
}
.title span:active {
  border: 1px solid black;
}
.fileList {
  margin: 10px auto;
  text-align: center;
}
button {
  width: 66px;
  height: 30px;
  border: 0px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: rgb(126, 126, 126);
  transition: all 0.5s ease;
  margin: 0px 30px 10px 30px;
}
button:hover {
  box-shadow: 0 0 6px rgba(18, 18, 18, 0.8);
  color: azure;
  background-color: skyblue;
  cursor: pointer;
}
.uploadContainer {
  box-shadow: 0 0 12px rgba(18, 18, 18, 0.3);
  border-radius: 15px;
  margin-bottom: 20px;
  width: 400px;
  background-color: #fff;
}
hr {
  width: 90%;
  margin: 0px auto 10px auto;
}
.fileList h3 {
  font-size: 20px;
  display: block;
  margin: 0 auto;
  color: gray;
  line-height: 50px;
}
.fileList h3[calculateSuccess=true] {
  padding-left: 30px;
  color:rgb(9, 157, 78);
}
.nameContainer span{
  float: right;
  padding-right: 30px;
}
p {
  text-align: center;
  color: #bbb;
  font-size: 12px;
  font-weight: 400;
}
p a {
  color: #a1a1a1;
  line-height: 20px;
  font-weight: 500;
  transition: all 0.5s ease;
}
input[type="file"][name="GAUSSIAN"] {
  cursor: not-allowed;
}
input[type="file"] {
  height: 30px;
  width: 180px;
  margin: 10px auto;
  border: 1px solid black;
  display: none;
}
input[type="text"] {
  height: 50px;
  margin: 0 auto;
  font-size: 20px;
  outline: none;
  line-height: 50px;
  border: none;
  width: 100%;
  text-align: center;
  display: block;
  background-color: transparent;
}
.nameContainer {
  height: 50px;
}
.fileContainer {
  /* height: 280px; */
  width: 90%;
  border-radius: 10px;
  border: 1px dashed #7e7e7e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 15px auto;
}
.uploadFile {
  height: 80px;
  background-color: #e4e4e4;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  border-radius: 8px;
  margin: 5px auto;
}
.uploadFile[success="true"] {
  background-color: rgba(57, 173, 112, 0.7);
  color: #fff;
}
.uploadFile[success="true"] div p,
.uploadFile[success="true"] p {
  color: #fff;
}
.uploadFile[success="true"] div label {
  background-color: rgb(9, 157, 78);
}
.uploadFile > p:nth-child(1) {
  border-right: 1px solid rgb(126, 126, 126);
  width: 180px;
  padding: 0 5px;
  line-height: 30px;
}

.uploadFile div {
  width: 180px;
}
.uploadFile div p {
  color: rgb(126, 126, 126);
  line-height: 30px;
}
.uploadFile div label {
  cursor: pointer;
  transition: all 0.5s ease;
  color: #fff;
  font-weight: 500;
}
.uploadFile div label:hover {
  color: black;
}
label {
  display: inline-block;
  width: 80px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  font-size: 13px;
  text-align: center;
  line-height: 20px;
  background-color: #ccc;
}
label:active {
  background-color: #ccc;
  border: 1px solid black;
  transition: all 1s ease;
}
</style>
