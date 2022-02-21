const getAllIds = async () => {
    const productIds = await ProductModel.find({}).select({ ProductId: 1 });
    return productIds;
}