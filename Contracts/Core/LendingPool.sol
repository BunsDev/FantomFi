// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// - Create a pool contract that accepts deposit from lenders , who earn interest on lending
// - User  or borrower can borrow some amount of tokens (limited) , and pay back with some interest for some time period.
// - lender can withdraw the amount later with some interest

// import "../Other/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// to maintain the track we need to mint and Burn Tokens
// Provide allowance first by calling approve()

contract LendingPool is ERC20 {
    /// intialize token
    ERC20 immutable token;
    address public immutable tokenAddress;
    uint256 totalPoolSupply;

    /// the rate earned by the lender per second
    uint256 lendRate = 100;
    /// the rate paid by the borrower per second
    uint256 borrowRate = 130;

    uint256 peroidBorrowed;

    ///  struct with amount and date of borrowing or lending
    struct Amount {
        uint256 amount;
        uint256 start;
    }

    // mapping to check if the address has lended any amount
    mapping(address => Amount) lendAmount;
    // mapping for the interest earned by the lender ;
    mapping(address => uint256) earnedInterest;

    // arrays to store the info about lender & borrowers
    mapping(address => bool) lenders;
    mapping(address => bool) borrowers;

    // mapping to check if the address has borrowed any amount
    mapping(address => Amount) borrowAmount;
    // mapping for the interest to be paid by the borrower ;
    mapping(address => uint256) payInterest;

    /// events
    event Deposit(address user, uint256 amount);
    event Withdraw(address user, uint256 amount);

    event Borrow(address user, uint256 amount);
    event Repay(address user, uint256 amount);

    /// making the contract payable and adding the tokens in starting to the pool

    constructor(address _tokenAddress) ERC20("XToken", "XT") {
        token = ERC20(_tokenAddress);
        tokenAddress = _tokenAddress;
    }

    function calculateRepayAmount(address user, uint256 repayAmount)
        public
        view
        returns (uint256 amount)
    {
        /// total amount to be repaid with intrest
        Amount storage amount_ = borrowAmount[user];

        uint256 _amount = (amount_.amount +
            (amount_.amount *
                ((block.timestamp - amount_.start) * borrowRate * 1e18)) /
            totalPoolSupply);
    }

    function calculateWithdrawAmount() public view returns (uint256 amount) {}

    /// @dev - to lend the amount by  , add liquidity
    /// @param _amount - deposited amount
    function deposit(uint256 _amount, address user) external {
        require(_amount != 0, " amount can not be 0");

        /// transferring the tokens to the pool contract
        token.transferFrom(user, address(this), _amount);

        /// adding in lending and lenders array for record
        lendAmount[user].amount = _amount;
        lendAmount[user].start = block.timestamp;
        lenders[user] = true;

        _mint(user, _amount);

        /// updating total supply
        totalPoolSupply += _amount;
    }

    /// @dev - to borrow token
    /// @param _amount - amount to be withdraw
    function borrow(uint256 _amount, address user) external {
        require(_amount != 0, " amount can not be 0");

        /// Amount can not be sent
        require(_amount < totalPoolSupply / 100, "Amount is incorrect");

        /// updating records first
        borrowAmount[user].amount = _amount;
        borrowAmount[user].start = block.timestamp;
        totalPoolSupply -= _amount;

        /// then transfer
        token.transfer(user, _amount);

        /// tokenApproval to deduct under liquidation
        token.approve(address(this), _amount);

        borrowers[user] = true;
    }

    /// @dev  - repay the whole loan
    function repay(address user, uint256 amount) external {
        /// check borrower
        require(borrowers[msg.sender], "not a borrower");

        uint256 _amount = calculateRepayAmount(user, amount);
        require(_amount != 0, " amount can not be 0");

        /// transferring the tokens
        token.transferFrom(msg.sender, address(this), _amount);

        /// updating records and deleting the record of borrowing
        delete borrowAmount[msg.sender];
        borrowers[msg.sender] = false;

        /// update total supply at the end
        totalPoolSupply += _amount;
    }

    /// @dev  - to withdraw the amount for the lender
    function withdraw() external {
        /// checking if the caller is a lender or not
        require(lenders[msg.sender], "you are not a lender");

        // calculating the total amount along with the interest
        Amount storage amount_ = lendAmount[msg.sender];
        uint256 _amount = (amount_.amount +
            (amount_.amount *
                ((block.timestamp - amount_.start) * lendRate * 1e18)) /
            totalPoolSupply);

        require(_amount != 0, " amount can not be 0");

        /// deleting the records and updating the list
        delete lendAmount[msg.sender];
        lenders[msg.sender] = false;

        _burn(msg.sender, amount_.amount);

        /// updating total supply earlier before transfering token , so as to be safe from attacks
        totalPoolSupply -= _amount;

        /// transferring the tokens in the end
        token.transfer(msg.sender, _amount);
    }

    function liquidate(address user, uint256 amount) public {}
}
