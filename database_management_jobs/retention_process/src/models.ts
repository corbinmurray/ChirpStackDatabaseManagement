import { DataTypes, Model } from "sequelize";
import { getSequelize } from "./configs";

const sequelize = getSequelize();

class DeviceError extends Model {}

DeviceError.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dev_eui: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    device_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    application_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    application_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    error: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    f_cnt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.HSTORE,
      allowNull: false,
    },
  },
  { tableName: "device_error", modelName: "DeviceError", sequelize: sequelize }
);


export default DeviceError;
