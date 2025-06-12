import {
  Alert,
  AlertIcon,
  Flex,
  HStack, IconButton,
  Menu,
  MenuButton, MenuDivider, MenuItem, MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs, Text, useDisclosure
} from "@chakra-ui/react";
import useGetPollCategories from "../../hooks/queries/categories/useGetPollCategories.ts";
import {useParams} from "react-router";
import GeneralErrorPage from "../../components/GeneralErrorPage.tsx";
import LoadingPage from "../../components/LoadingPage.tsx";
import CategoryDetails from "./CategoryDetails.tsx";
import {AddIcon, DeleteIcon, EditIcon, HamburgerIcon} from "@chakra-ui/icons";
import CategoryForm from "./CategoryFrom.tsx";
import {useState} from "react";
import type {Category} from "../../models/types.ts";
import {useSelectedPollTypeContext} from "../../contexts/SelectedPollTypeContext.tsx";
import useDeleteCategory from "../../hooks/mutations/categories/useDeleteCategory.ts";

export default function Categories() {
  const {pollId, workspaceId} = useParams();
  const {data, isLoading, error} = useGetPollCategories(Number(pollId!));
  const {onOpen, isOpen, onClose} = useDisclosure()
  
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const {value} = useSelectedPollTypeContext();
  
  const deleteMutation = useDeleteCategory(Number(pollId!));
  
  if (error) {
    return (
        <GeneralErrorPage message={error.message} />
    )
  }
  
  if (isLoading) {
    return <LoadingPage />
  }
  
  const onCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    onOpen();
  }
  
  return (
      <>
        <Flex flexDirection="column" w={"full"} h={"full"}>
          {data!.length === 0 && (
              <Alert status="info" w="full" mt={4}>
                <AlertIcon />
                No categories found. Please add a new category.
              </Alert>
          )}

          {data!.length > 0 && (
              <Tabs>
                <TabList>
                  {data!.map((category) => (
                      <Tab key={category.id}>
                        <HStack>
                          <Text>
                            {category.title}
                          </Text>

                          <Menu>
                            <MenuButton
                                size={'sm'}
                                as={IconButton}
                                aria-label='Options'
                                icon={<HamburgerIcon />}
                                variant='outline'
                            />
                            <MenuList>
                              <MenuItem icon={<EditIcon />} onClick={() => onCategoryChange(category)}>
                                Edit Category
                              </MenuItem>

                              {value.includes("Candidates") && (
                                  <MenuItem icon={<AddIcon />}>
                                    Add Candidates
                                  </MenuItem>
                              )}

                              {value.includes("Items") && (
                                  <MenuItem icon={<AddIcon />}>
                                    Add Items
                                  </MenuItem>
                              )}
                              
                              <MenuDivider />
                              <MenuItem color={'red'} icon={<DeleteIcon />} onClick={() => deleteMutation.mutateAsync(category.id)}>
                                Delete Category
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Tab>
                  ))}

                  <Tab>
                    <IconButton onClick={() => {
                      setSelectedCategory(undefined)
                      onOpen()
                    }} size={'sm'} aria-label={"Add a category"} icon={<AddIcon />} variant={'outline'} colorScheme={'cyan'} />
                  </Tab>
                </TabList>

                <TabPanels>
                  {data!.map((category) => (
                      <TabPanel key={category.title}>
                        <CategoryDetails category={category} />
                      </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
          )}
        </Flex>

        <CategoryForm category={selectedCategory ?? undefined} isOpen={isOpen} onClose={onClose} pollId={Number(pollId!)} workspaceId={Number(workspaceId!)} />
      </>
  )
}
