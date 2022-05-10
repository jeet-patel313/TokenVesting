pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Erc is ERC20 {
    address public owner;
    // /**
    //  * @title   mints ERC20 custom token with 100 million token supply
    //  */
    constructor() ERC20('ERCTask', 'ERT') {
        owner = msg.sender;
        _mint(owner, 100000000 * 1e18);
    }
}

// /**
//  * @title   Token Vesting Smart Contract with 3 roles
//  * @notice  3 roles: Advisor, Partnership, Mentor
//  * @notice  Create a Token Vesting Contract with 5% TGE for Advisors, 0 % TGE for Partnerships and 7% TGE for Mentors with 2 months cliff and 22  months linear vesting for all roles
//  * @author  Jeet Patel
//  */
contract VestingContract is AccessControl, Erc {
    mapping(address => uint) public _balanceOf;

    mapping(address => uint) public _withdrawalMonth;

    // Create a new role identifier for the advisor role
    bytes32 public constant ADVISOR_ROLE = keccak256("ADVISOR_ROLE");
    // Create a new role identifier for the partner role
    bytes32 public constant PARTNER_ROLE = keccak256("PARTNER_ROLE");
    // Create a new role identifier for the mentor role
    bytes32 public constant MENTOR_ROLE = keccak256("MENTOR_ROLE");

    /// setup variable for cliff time period initiation
    uint256 public tokenGenerationEvent;
    /// declare variable for cliff time period termination
    uint public cliffPeriodTermination;

    uint public _monthNumber = 0;

    uint public _secondsDifference;

    /// token release per month = 4,000,000 
    uint256 public monthlyTokenAmt = 88000000 * 1e18 / 22; 

    /// calculate monthly additional tokens for each roles
    uint256 public monthlyAdvisorAmt = monthlyTokenAmt * 1 / 4; //25% of the monthly release
    uint256 public monthlyPartnerAmt = monthlyTokenAmt * 1 / 4; //25% of the monthly release
    uint256 public monthlyMentorAmt = monthlyTokenAmt * 2 / 4; // 50% of the monthly release

    constructor(address advisor, address partner, address mentor) {
        /// Grant the contract deployer the default admin role: it will be able
        /// to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, owner);

        /// assign advisor, partner and mentor roles
        _setupRole(ADVISOR_ROLE, advisor);
        _setupRole(PARTNER_ROLE, partner);
        _setupRole(MENTOR_ROLE, mentor);

        /// assign current time to TGE
        tokenGenerationEvent = block.timestamp;
        /// assign cliff time period
        cliffPeriodTermination = block.timestamp + 60 days;

        /// Assign initial tokens and transfer to the 3 roles
        _transfer(owner, advisor, 1000000 * 5 * 1e18);
        _transfer(owner, mentor, 1000000 * 7 * 1e18);
    }


    /// withdraw the tokens if available 
    /// input the amounts of token to withdraw and check the role of the account
    function withdrawToken() public {
        /// check the role of the account
        if (hasRole(ADVISOR_ROLE, msg.sender) == true) {
            calculate(1);
        } else if (hasRole(PARTNER_ROLE, msg.sender) == true) {
            calculate(2);
        } else if (hasRole(MENTOR_ROLE, msg.sender) == true) {
            calculate(3);
        }
    }

    function calculate(uint256 role) private {
        // check the current time and check if cliff has terminated or not
        require (block.timestamp >= cliffPeriodTermination, 'Cliff not expired');
        // check how many minutes more than cliff 
        if(block.timestamp > cliffPeriodTermination){
            _secondsDifference = block.timestamp - cliffPeriodTermination;
            _monthNumber = _secondsDifference / 2592000;
            if(_monthNumber <= 22) {
                if(role == 1) {
                    transferAndSend((_monthNumber - _withdrawalMonth[msg.sender]), monthlyAdvisorAmt);
                } else if(role == 2) {
                    transferAndSend((_monthNumber - _withdrawalMonth[msg.sender]), monthlyPartnerAmt);
                } else if(role == 3) {
                    transferAndSend((_monthNumber - _withdrawalMonth[msg.sender]), monthlyMentorAmt);  
                }
                _withdrawalMonth[msg.sender] = _monthNumber;
            }
        }
    }       

    function transferAndSend(uint256 _month, uint256 _monthlyAmt) internal {
        _balanceOf[msg.sender] = _month * _monthlyAmt;
        _transfer(owner, msg.sender, _balanceOf[msg.sender]);
    }
}