import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCount } from "../counterAPI";
const initialState = {
  value: 0,
  status: "idle",
};

// 非同期処理　Thunk
// thunkを使うことで通常のアクションのようにディスパッチできます: `dispatch(incrementAsync(10))`。
// useEffectとか非同期処理を書く方法は他にもあるけどdispatchで統一できるんだと思われる
export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount) => {
    const response = await fetchCount(amount);
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  // 「extraReducers」フィールドを使用すると、スライスは他の場所で定義されたアクションを処理できます。
  //  これには、createAsyncThunk または他のスライスによって生成されたアクションが含まれます。
  // こいつは個別export いらんみたい。呼び出す関数はincrementAsyncでよいらしい。
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      });
  },
});

export const selectCount = (state) => state.counter.value;

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 同期ロジックと非同期ロジックの両方を含むサンクを手動で記述することもできます。
// 現在の状態に基づいて条件付きでアクションをディスパッチする例を次に示します。
// こいつはcreateSliceの中にも書かないからaction としてexport ではない。
// どっちかというと　引数取りつつ任意の処理した後createsliceのactionを呼び出す関数だから活用方法くらいの位置づけだな
export const incrementIfOdd = (amount) => (dispatch, getState) => {
  //reduxのgetStateで現在の状態を取得
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default counterSlice.reducer;
