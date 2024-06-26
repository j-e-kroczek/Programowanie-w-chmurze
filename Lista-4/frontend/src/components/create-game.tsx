import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CreateGame: React.FC<{
  handleSubmit: (v: string) => void;
  handleCancel: () => void;
}> = ({ handleSubmit, handleCancel }) => {
  const GameNameSchema = Yup.object().shape({
    gameName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
  });

  return (
    <div className="absolute w-screen h-screen bg-black/40 top-0 left-0 z-30">
      <div className="flex w-full h-full flex-col justify-center items-center">
        <div className="bg-white px-8 pb-8 pt-9 rounded-xl m-5 relative">
          <button
            onClick={handleCancel}
            className="absolute top-3 right-3 rounded-full w-5 h-5 p-0 text-xs flex justify-center items-center  focus:outline-none bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h1 className="text-3xl font-medium pb-6 pt-1">Create new game</h1>
          <Formik
            initialValues={{
              gameName: "",
            }}
            validationSchema={GameNameSchema}
            onSubmit={(values) => {
              handleSubmit(values.gameName);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="flex items-center border-b border-purple-500 py-2">
                  <Field
                    name="gameName"
                    type="text"
                    placeholder="Game name"
                    aria-label="Game name"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  />
                  <button
                    className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-3 rounded-full focus:outline-none	"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
                {errors.gameName && touched.gameName ? (
                  <div className="pt-2 text-red-600">{errors.gameName}</div>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
