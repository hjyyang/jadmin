const multer = require("@koa/multer");
const node_path = require("path");
const fs = require("fs");
const uploadPath = "../../static/upload";

class Files {
  constructor() {}
  getStat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      });
    });
  }
  mkdir(dir) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  getAll() {
    let dirPath = node_path.resolve(__dirname, uploadPath),
      fileList = [],
      deep = 1;
    return new Promise(function(resolve, reject) {
      !(function getFile(dirPath) {
        fs.readdir(dirPath, function(err, files) {
          if (files === undefined) {
            fs.mkdir(dirPath, err => {
              if (err) {
                resolve(false);
              } else {
                resolve([]);
              }
            });
          } else {
            files.forEach(item => {
              let fPath = node_path.join(dirPath, item);
              let stat = fs.statSync(fPath);
              if (stat.isDirectory() === true) {
                ++deep;
                getFile(fPath);
              } else if (stat.isFile() === true) {
                let fileObj = {},
                  fileName,
                  fileUrl;
                if (fPath.indexOf("\\") == -1) {
                  fileName = fPath.split("/")[fPath.split("/").length - 1];
                } else {
                  fileName = fPath.split("\\")[fPath.split("\\").length - 1];
                }
                if (fileName.indexOf(".") != 0) {
                  //排除.开头的文件
                  fileObj["name"] = fileName;
                  fileUrl = fPath.split("static")[
                    fPath.split("static").length - 1
                  ];
                  var re = new RegExp("\\\\", "g");
                  fileObj["url"] = fileUrl.replace(re, "/");
                  fileObj["size"] = stat.size;
                  fileList.push(fileObj);
                }
              }
            });
            --deep;
            if (deep === 0) {
              resolve(fileList);
            }
          }
        });
      })(dirPath);
    });
  }
  delete(path) {
    return new Promise(function(resolve, reject) {
      fs.unlink(node_path.resolve(__dirname, "../../static" + path), function(
        err
      ) {
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }
  isExists(path) {
    let stat = fs.existsSync(
      node_path.resolve(__dirname, "../../static" + path)
    );
    if (stat) {
      //已存在改路径文件
      let pathArr = path.split(".");
      pathArr[pathArr.length - 2] = pathArr[pathArr.length - 2] + "(2)";
      pathArr = pathArr.join(".");
      return this.isExists(pathArr);
    } else {
      return path;
    }
  }
  rename(oldPath, newPath) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let exist = fs.existsSync(
        node_path.resolve(__dirname, "../../static" + oldPath)
      );
      if (!exist) {
        //原地址不存在
        resolve(false);
      }
      let result = self.isExists(newPath);
      fs.rename(
        node_path.resolve(__dirname, "../../static" + oldPath),
        node_path.resolve(__dirname, "../../static" + result),
        err => {
          if (err) {
            resolve(false);
          }
          resolve(result);
        }
      );
    });
  }
}

var fileMethod = new Files();

//配置
var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    let siteDate = new Date(),
      dir,
      dir2,
      targetDir;
    dir = node_path.resolve(
      __dirname,
      uploadPath + "/" + siteDate.getFullYear()
    );

    if (siteDate.getMonth() > 9) {
      dir2 = dir + "/" + (siteDate.getMonth() + 1);
      targetDir =
        "/" + siteDate.getFullYear() + "/" + (siteDate.getMonth() + 1);
    } else {
      dir2 = dir + "/0" + (siteDate.getMonth() + 1);
      targetDir =
        "/" + siteDate.getFullYear() + "/0" + (siteDate.getMonth() + 1);
    }

    async function dirExists(dir) {
      let isExists = await fileMethod.getStat(dir);

      if (isExists && isExists.isDirectory()) {
        return true;
      } else if (isExists) {
        //如果该路径存在且是文件，返回false
        return false;
      }

      //如果该路径不存在
      let tempDir = node_path.parse(dir).dir; //拿到上级路径
      //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
      let status = await dirExists(tempDir);
      let mkdirStatus;
      if (status) {
        mkdirStatus = await fileMethod.mkdir(dir);
      }
      return mkdirStatus;
    }
    dirExists(node_path.resolve(dir2, "")).then(result => {
      cb(null, "static/upload" + targetDir);
    });
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split("."); //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
//加载配置
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3 // 限制2M
  }
});

module.exports = { fileMethod, upload };
