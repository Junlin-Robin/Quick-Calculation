import decimal from "decimal.js";
interface AtomInformation {
  [propname: string]: {
    number: number;
    position: number[][];
  };
}
//处理文本
export default function dealFile(
  data_lighter: string,
  data_heavier: string,
  cellFile: string
): {results:number[],isotopeInformation:any[]} {
  let Array_lighter = data_lighter
    .split("\n")
    .map((item: string) => item.trim())
    .filter((item) => item !== "");
  let Array_heavier = data_heavier
    .split("\n")
    .map((item: string) => item.trim())
    .filter((item) => item !== "");

  return matchFrequency(Array_lighter, Array_heavier, cellFile);
}
//匹配频率
function matchFrequency(
  lighter: string[],
  heavier: string[],
  cellFile: string
) {
  let matchReg_Freq = new RegExp(
    "^\\+\\s*[0-9]+\\s*[\\-,0-9,\\.]*\\s*[a,b,c,d].*\\+$"
  );
  let matchReg_AtomIformation = new RegExp("^x  [A-Z]+.*[0-9]+   x$");
  let frequencyMatrix_lighter: number[] = [],
    frequencyMatrix_heavier: number[] = [],
    elementInformation_lighter: any[] = [],
    elementInformation_heavier: any[] = [],
    atomInformation: AtomInformation = {},
    ISotopeatomNumber: number = 1,
    flag = false,
    fixISOnumber = 0,
    Isotope = '';
  lighter.forEach((item) => {
    if (matchReg_Freq.test(item)) {
      let temp = item.split(" ").filter((item) => {
        if (item) return item;
      });
      frequencyMatrix_lighter.push(Number(temp[2]));
    }

    if (item.includes("Electric Quadrupole Moment")) {
      flag = false;
    }

    if (matchReg_AtomIformation.test(item)) {
      let temp: string[] = item.split(" ").filter((item) => item !== "");
      if (atomInformation[temp[1]] !== undefined) {
        atomInformation[temp[1]].number += 1;
        atomInformation[temp[1]].position.push([
          Number(temp[3]),
          Number(temp[4]),
          Number(temp[5]),
        ]);
      } else {
        atomInformation[temp[1]] = {
          number: 1,
          position: [[Number(temp[3]), Number(temp[4]), Number(temp[5])]],
        };
      }
    }
    if (flag) {
      elementInformation_lighter.push(
        item.split(" ").filter((item) => item !== "")
      );
    }
    if (item.includes("Mass of species in AMU")) {
      flag = true;
    }
  });
  heavier.forEach((item) => {
    if (matchReg_Freq.test(item)) {
      let temp = item.split(" ").filter((item) => {
        if (item) return item;
      });
      frequencyMatrix_heavier.push(Number(temp[2]));
    }

    if (item.includes("Electric Quadrupole Moment")) {
      flag = false;
    }
    if (flag) {
      elementInformation_heavier.push(
        item.split(" ").filter((item) => item !== "")
      );
    }
    if (item.includes("Mass of species in AMU")) {
      flag = true;
    }
  });

  for (let i = 0; i < elementInformation_heavier.length; i++) {
    if (elementInformation_lighter[i][1] !== elementInformation_heavier[i][1]) {
      Isotope = elementInformation_heavier[i][0];
      ISotopeatomNumber =
        atomInformation[elementInformation_heavier[i][0]].number;
      //匹配个数
      if (cellFile !== "") {
        const match_BlockAtoms = new RegExp(
          "%BLOCK IONIC_CONSTRAINTS\\r\\n([\\w,\\W,.]*)%ENDBLOCK IONIC_CONSTRAINTS",
          "g"
        );
        const BlockAtomArr = (match_BlockAtoms.exec(cellFile) as string[])[1]
          .split("\r\n")
          .filter((item) => item !== "")
          .map((item) => {
            let temp = item
              .trim()
              .split(" ")
              .filter((item) => item !== "");
            return temp[1];
          });
        BlockAtomArr.forEach((item) => {
          if (item === Isotope) fixISOnumber++;
        });
      };
      ISotopeatomNumber = ISotopeatomNumber - fixISOnumber/3;
      break;
    }
    //简单判断数据数据格式是否有问题
    if(frequencyMatrix_heavier.length !== frequencyMatrix_lighter.length) throw new Error()
    //判断cell文件是否有问题;逻辑太复杂很后期维护再改，目前不影响使用
    
  }

  return calculateRPFR(
    frequencyMatrix_lighter,
    frequencyMatrix_heavier,
    ISotopeatomNumber,
    fixISOnumber/3,
    Isotope
  );
}

//匹配力常数
function calculateRPFR(
  lighterArr: number[],
  heavierArr: number[],
  atomNumber: number,
  fixatoms:number,
  isotope:string
) {
  let angular_lighter: number[],
    angular_heavier: number[],
    u_lighter,
    u_heavier,
    PFR: number[] = [],
    RPFR: number,
    beita: number;
  const c = 29979245800,
    h = 6.62607004e-34,
    k = 1.38064852e-23,
    // T = [273.15, 298.15, 303.15, 400, 500, 600, 700, 800, 900, 1000],
    T = [1000, 900, 800, 700, 600, 500, 400, 303.15, 298.15, 273.15],
    results: any[] = [];
  angular_lighter = lighterArr.map((item: number) =>
    decimal.mul(item, c).toNumber()
  );
  angular_heavier = heavierArr.map((item: number) =>
    decimal.mul(item, c).toNumber()
  );
  T.forEach((itemT) => {
    u_lighter = angular_lighter.map((item: number) =>
      new decimal(item).mul(h).div(k).div(itemT).toNumber()
    );
    u_heavier = angular_heavier.map((item: number) =>
      new decimal(item).mul(h).div(k).div(itemT).toNumber()
    );
    PFR = [];
    for (let i = 0; i < u_lighter.length; i++) {
      let Numerator = new decimal(-u_heavier[i] / 2)
        .exp()
        .mul(u_heavier[i])
        .mul(1 - new decimal(-u_lighter[i]).exp().toNumber())
        .toNumber();
      let Demoninator = new decimal(-u_lighter[i] / 2)
        .exp()
        .mul(u_lighter[i])
        .mul(1 - new decimal(-u_heavier[i]).exp().toNumber())
        .toNumber();
      PFR.push(decimal.div(Numerator, Demoninator).toNumber());
    }
    RPFR = PFR.reduce((pre, acc) => {
      return decimal.mul(pre, acc).toNumber();
    });
    beita = decimal
      .pow(RPFR, 1 / atomNumber)
      .ln()
      .mul(1000)
      .toNumber();
    results.push({
      temperature: itemT - 273.15,
      row: decimal.div(1000000, decimal.pow(itemT, 2).toNumber()).toNumber(),
      column: beita,
    });
  });
  const isotopeInformation = [isotope,atomNumber,fixatoms]
  return {results,isotopeInformation};
}
