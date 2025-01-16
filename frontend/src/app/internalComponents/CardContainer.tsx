"use client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, PlusCircle, Trash2 } from "lucide-react";
import {
  ErrorMessage,
  Form,
  Formik,
  FormikConfig,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { listUserSchema, userSchema, TUser, TUserlist } from "@/app/scehma";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { addUsers, deleteUser, updateUsers } from "@/actions/userActions";

const LabelInput = ({
  values,
  name,
  placeHolder,
  title,
  handleChange,
  type = "text",
}: {
  values: any;
  placeHolder: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  name: string;
  title: string;
  handleChange?: FormikProps<TUser>["handleChange"];
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">{title}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeHolder}
        value={values}
        onChange={handleChange}
      />
      <ErrorMessage name={name} className="bg-red-500 text-sm" />
    </div>
  );
};

const CardForm = ({
  userRef,
  edit = false,
  submitForm,
  closeDialogBox,
  user,
}: {
  userRef: RefObject<FormikProps<TUser> | null>;
  submitForm: FormikConfig<TUser>["onSubmit"];
  edit?: boolean;
  closeDialogBox?: () => void;
  user?: TUser;
}) => {
  const initialValues: TUser =
    user && user?.id
      ? { ...user, password: "" }
      : {
          email: "",
          name: "",
          date_of_birth: "",
          password: "",
        };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={userSchema}
    >
      {({ handleChange, values, ...props }) => {
        userRef.current = { handleChange, values, ...props };
        return (
          <Form className="space-y-4">
            <LabelInput
              name="name"
              placeHolder="User name"
              title="User name"
              values={values.name}
              handleChange={handleChange}
            />
            <LabelInput
              name="email"
              placeHolder="User email"
              title="Email address"
              type="email"
              values={values.email}
              handleChange={handleChange}
            />

            <LabelInput
              name="date_of_birth"
              placeHolder="Date of birth"
              title="Date of birth"
              type="date"
              values={values.date_of_birth}
              handleChange={handleChange}
            />

            <LabelInput
              name="password"
              placeHolder="Password"
              title="Password"
              type="password"
              values={values.password}
              handleChange={handleChange}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (closeDialogBox) {
                  props.resetForm({ values: initialValues });
                  return closeDialogBox();
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="mx-2">
              {edit ? "Edit user" : "Create User"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};
const CardContainer = ({ users }: { users: TUserlist }) => {
  const [userList, setUserList] = useState<TUserlist>(users);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(-1);
  const userFormRef = useRef<FormikProps<TUser> | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    if (users?.length === 0) {
      toast({ title: "No users", description: "No users list found" });
      return;
    }

    return () => {};
  }, []);

  const closeDialogBox = () => {
    setEdit(false);
    setSelectedUser(-1);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(value) => {
              setEdit(false);
              setSelectedUser(-1);
              setIsDialogOpen(value);
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Users
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {edit ? "Edit user" : "Create new user"}
                </DialogTitle>
              </DialogHeader>

              <CardForm
                userRef={userFormRef}
                edit={edit}
                user={userList?.[selectedUser]}
                submitForm={async (values, { resetForm }) => {
                  try {
                    if (edit && selectedUser > -1) {
                      const response = await updateUsers(values);
                      setUserList((prev) => {
                        if (!prev) {
                          return [];
                        }
                        prev[selectedUser] = response;
                        return prev;
                      });
                      toast({
                        title: "Users",
                        description: "User edited successfully",
                      });
                    } else {
                      const response = await addUsers(values);
                      setUserList((prev) => [response, ...(prev || [])]);
                      toast({
                        title: "Users",
                        description: "User added successfully",
                      });
                    }
                    resetForm({ values: userFormRef.current?.initialValues });
                    closeDialogBox();
                  } catch (err) {
                    const error = (await err) as Record<string, string>;
                    console.log(error);

                    toast({ title: "Error", description: error.error });
                  }
                }}
              />

              {/* <div className="flex justify-end gap-2 mt-4">
                
              </div> */}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userList &&
            userList?.length > 0 &&
            userList.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  {/* <Image
                    src={
                      
                    }
                    alt={"Main"}
                    width={500}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  /> */}
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{item.date_of_birth}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{item.name}</DialogTitle>
                      </DialogHeader>
                      {/* <Image
                        src={
                          "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                        }
                        alt={"camera"}
                        width={500}
                        height={400}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      /> */}
                      <p className="mt-2">{item.email}</p>
                      <p className="mt-4">{item.date_of_birth}</p>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEdit(true);
                      setSelectedUser(index);
                      setIsDialogOpen(true);
                      // setSelectedCard(card);
                      // setShowPasswordDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this user? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-700"
                          onClick={async () => {
                            try {
                              await deleteUser(item.id ?? "");
                              toast({
                                title: "Users",
                                description: "User deleted successfully",
                              });
                              setUserList((prev) => {
                                if (!prev) {
                                  return [];
                                }

                                delete prev[index];
                                return prev;
                              });
                            } catch (err) {
                              const error = (await err) as Record<
                                string,
                                string
                              >;
                              toast({
                                title: "Error",
                                description: error.error,
                              });
                            }
                            // setSelectedCard(card);
                            // setShowPasswordDialog(true);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}

          {/* {cards.map((card) => (
            <Card key={card.id} className="flex flex-col">
              <CardHeader>
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{card.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{card.title}</DialogTitle>
                    </DialogHeader>
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="mt-2">{card.description}</p>
                    <p className="mt-4">{card.content}</p>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedCard(card);
                    setShowPasswordDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Card</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this card? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setSelectedCard(card);
                          setShowPasswordDialog(true);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))} */}
        </div>

        {/* <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Enter Card Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter card password"
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPasswordInput("");
                    setPasswordError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    verifyPassword(
                      selectedCard === editingCard ? "edit" : "delete"
                    )
                  }
                >
                  Verify
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export { CardContainer };
