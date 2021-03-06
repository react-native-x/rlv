"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const recyclerlistview_1 = require("recyclerlistview");
const LayoutUtil_1 = require("./LayoutUtil");
function RLV(props) {
    const { rowRenderer, getData, limit = 10, layoutProviderType, containerStyle, rlvStyle, rlvContentContainerStyle, cellHeight, noDataMessageRenderer, updateDataProvider, // update existing data
    getDataById, setNewData, } = props;
    const [state, setState] = react_1.useState({
        dataProvider: new recyclerlistview_1.DataProvider((r1, r2) => {
            return r1 !== r2;
        }),
        data: [],
        count: 0,
        showFooterLoader: false,
        idIndexMap: {},
        layoutProvider: LayoutUtil_1.getLayoutProvider(layoutProviderType, cellHeight),
    });
    const { dataProvider, layoutProvider, count, data: data1, showFooterLoader, idIndexMap: idIndexMap1 } = state;
    const data = data1;
    const idIndexMap = idIndexMap1;
    getDataById &&
        getDataById((id) => {
            const index = idIndexMap[id];
            return data[index];
        });
    updateDataProvider &&
        updateDataProvider((id, newPartialRecord) => {
            const index = idIndexMap[id];
            const oldRecord = data[index];
            const newRecord = { ...oldRecord, ...newPartialRecord };
            data[index] = newRecord;
            setState(_state => {
                return {
                    ..._state,
                    ...{ dataProvider: dataProvider.cloneWithRows(data, index) },
                };
            });
        });
    setNewData &&
        setNewData((newData) => {
            if (newData && Array.isArray(newData) && newData.length) {
                const newIdIndexMap = {};
                newData.forEach((d, i) => {
                    newIdIndexMap[d.id] = i;
                });
                setState(_state => {
                    return {
                        ..._state,
                        ...{
                            dataProvider: dataProvider.cloneWithRows(newData),
                            data: newData,
                            count: newData.length,
                            idIndexMap: newIdIndexMap,
                        },
                    };
                });
            }
        });
    function renderFooter() {
        // Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
        // The empty view can be removed once you've fetched all the data
        return showFooterLoader ? (react_1.default.createElement(react_native_1.ActivityIndicator, { style: styles.mar10, size: "large", color: "black" })) : (react_1.default.createElement(react_native_1.View, { style: styles.hei60 }));
    }
    async function fetchMoreData() {
        setState(_state => {
            return {
                ..._state,
                ...{ showFooterLoader: true },
            };
        });
        const newData = await getData(count, limit);
        newData.forEach((d, i) => {
            idIndexMap[d.id] = count + i;
        });
        const allData = data.concat(newData);
        setState(_state => {
            return {
                ..._state,
                ...{
                    showFooterLoader: false,
                    dataProvider: dataProvider.cloneWithRows(allData),
                    data: allData,
                    count: allData.length,
                },
            };
        });
    }
    function handleListEnd() {
        fetchMoreData();
    }
    react_1.useEffect(() => {
        fetchMoreData();
    }, []);
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, containerStyle] }, count > 0 ? (react_1.default.createElement(recyclerlistview_1.RecyclerListView, Object.assign({ style: [styles.fl1, rlvStyle], contentContainerStyle: [styles.mar3, rlvContentContainerStyle], onEndReached: handleListEnd, dataProvider: dataProvider, layoutProvider: layoutProvider, rowRenderer: rowRenderer, renderFooter: renderFooter }, props))) : (!showFooterLoader && noDataMessageRenderer && noDataMessageRenderer())));
}
exports.default = RLV;
const styles = react_native_1.StyleSheet.create({
    hei60: { height: 60 },
    mar10: { margin: 10 },
    mar3: { margin: 3 },
    fl1: { flex: 1 },
    container: {
        flex: 1,
    },
});
//# sourceMappingURL=RLV.js.map